import { Router, Request, Response, NextFunction } from "express";
import NotAuthorizedException from "../exceptions/NotAuthorizedException";
import Controller from "../interfaces/controller.interface";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import authMiddleware from "../middleware/auth.middleware";
import itemModel from "../item/item.model";
import userModel from "./user.model";
import UserNotFoundException from "../exceptions/UserNotFoundException";

class UserController implements Controller {
    public path = "/users";
    public router = Router();
    private item = itemModel;
    private user = userModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/:id`, authMiddleware, this.getUserById);
        this.router.get(`${this.path}/:id/items`, authMiddleware, this.getAllItemsOfUser);
    }

    private getUserById = async (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        const userQuery = this.user.findById(id);
        if (request.query.withItems === "true") {
            userQuery.populate("items").exec();
        }
        const user = await userQuery;
        if (user) {
            response.send(user);
        } else {
            next(new UserNotFoundException(id));
        }
    };

    private getAllItemsOfUser = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        const userId = request.params.id;
        if (userId === request.user._id.toString()) {
            const items = await this.item.find({ author: userId });
            response.send(items);
        }
        next(new NotAuthorizedException());
    };
}

export default UserController;
