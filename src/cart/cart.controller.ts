import { Response, NextFunction, Router } from "express";
import Controller from "../interfaces/controller.interface";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import authMiddleware from "../middleware/auth.middleware";
import validationMiddleware from "../middleware/validation.middleware";
import NotFoundException from "../exceptions/NotFoundException";
import CreateCartDto from "./cart.dto";
import Cart from "./cart.interface";
import cartModel from "./cart.model";
import HttpException from "../exceptions/HttpException";

class CartController implements Controller {
    public path = "/carts";
    public router = Router();
    private cart = cartModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router
            .all(`${this.path}/*`, authMiddleware)
            .get(this.path, this.getAllCarts)
            .get(`${this.path}/:id`, this.getChartById)
            .patch(`${this.path}/:id`, validationMiddleware(CreateCartDto, true), this.modifyCart)
            .post(this.path, authMiddleware, validationMiddleware(CreateCartDto), this.createCart)
            .get(`${this.path}/checkout/:id`, authMiddleware, this.checkout)
            .delete(`${this.path}/:id`, this.deleteCart);
    }

    private getAllCarts = async (request: RequestWithUser, response: Response) => {
        const carts = await this.cart.find({ user: request.user._id }).populate("user items.item", "-password");
        response.send(carts);
    };

    private getChartById = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        const id = request.params.id;
        const item = await this.cart.findOne({ id, user: request.user._id }).populate("user items.item");
        if (item) {
            response.send(item);
        } else {
            next(new NotFoundException("Cart", id));
        }
    };

    private modifyCart = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        const id = request.params.id;
        const itemData: Cart = request.body;
        const item = await this.cart.findOneAndUpdate({ id, user: request.user._id }, itemData, { new: true });
        if (item) {
            response.send(item);
        } else {
            next(new NotFoundException("Cart", id));
        }
    };

    private createCart = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        const cartData: CreateCartDto = request.body;
        const createdCart = new this.cart({ ...cartData, user: request.user._id });
        createdCart.id = createdCart._id;

        try {
            const savedCart = await createdCart.save();
            await savedCart.populate("user items.item", "-password");
            response.send(savedCart);
        } catch (err) {
            next(new HttpException(500, err.message));
        }
    };

    private checkout = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        const id = request.params.id;
        const carts: Cart = await this.cart.findOne({ id, user: request.user._id }).populate("items.item");
        const invalidItems = carts.items.filter(cart => cart.item.total < cart.total);
        if (invalidItems.length > 0) {
            next(
                new HttpException(
                    400,
                    "Invalid items in cart (number of item more than stock):\n" + JSON.stringify(invalidItems)
                )
            );
        } else {
            for (const cart of carts.items) {
                const item = cart.item as any;
                item.total -= cart.total;
                await item.save();
            }

            const updatedCart = await this.cart
                .findOneAndUpdate({ id, user: request.user._id }, { $set: { items: carts.items } }, { new: true })
                .populate("items.item");

            response.send(updatedCart);
        }
    };

    private deleteCart = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        const id = request.params.id;
        const successResponse = await this.cart.findOneAndDelete({ id, user: request.user._id });
        if (successResponse) {
            response.sendStatus(204);
        } else {
            next(new NotFoundException("Cart", id));
        }
    };
}

export default CartController;
