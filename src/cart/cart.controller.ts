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
            .post(this.path, validationMiddleware(CreateCartDto), this.createCart)
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

    private deleteCart = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        const id = request.params.id;
        const successResponse = await this.cart.findOneAndDelete({ id, user: request.user._id });
        if (successResponse) {
            response.send(200);
        } else {
            next(new NotFoundException("Cart", id));
        }
    };
}

export default CartController;
