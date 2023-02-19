import { Request, Response, NextFunction, Router } from "express";
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
        // this.router.get(this.path, this.getAllItems);
        // this.router.get(`${this.path}/:id`, this.getItemById);
        this.router
            .patch(`${this.path}/:id`, authMiddleware, validationMiddleware(CreateCartDto, true), this.modifyCart)
            // .delete(`${this.path}/:id`, this.deleteItem)
            .post(this.path, authMiddleware, validationMiddleware(CreateCartDto), this.createCart);
    }

    // private getAllItems = async (request: Request, response: Response) => {
    //     const items = await this.cart.find().populate("author", "-password");
    //     response.send(items);
    // };
    //
    // private getItemById = async (request: Request, response: Response, next: NextFunction) => {
    //     const id = request.params.id;
    //     const item = await this.cart.findById(id);
    //     if (item) {
    //         response.send(item);
    //     } else {
    //         next(new ItemNotFoundException(id));
    //     }
    // };
    //

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
            await savedCart.populate("user items", "-password");
            response.send(savedCart);
        } catch (err) {
            next(new HttpException(500, err.message));
        }
    };

    // private deleteItem = async (request: Request, response: Response, next: NextFunction) => {
    //     const id = request.params.id;
    //     const successResponse = await this.cart.findByIdAndDelete(id);
    //     if (successResponse) {
    //         response.send(200);
    //     } else {
    //         next(new ItemNotFoundException(id));
    //     }
    // };
}

export default CartController;
