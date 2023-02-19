import { Request, Response, NextFunction, Router } from "express";
import ItemNotFoundException from "../exceptions/ItemNotFoundException";
import Controller from "../interfaces/controller.interface";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import authMiddleware from "../middleware/auth.middleware";
import validationMiddleware from "../middleware/validation.middleware";
import CreateItemDto from "./item.dto";
import Item from "./item.interface";
import itemModel from "./item.model";

class ItemController implements Controller {
    public path = "/items";
    public router = Router();
    private item = itemModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllItems);
        this.router.get(`${this.path}/:id`, this.getItemById);
        this.router
            .all(`${this.path}/*`, authMiddleware)
            .patch(`${this.path}/:id`, validationMiddleware(CreateItemDto, true), this.modifyItem)
            .delete(`${this.path}/:id`, this.deleteItem)
            .post(this.path, authMiddleware, validationMiddleware(CreateItemDto), this.createItem);
    }

    private getAllItems = async (request: Request, response: Response) => {
        const items = await this.item.find().populate("author", "-password");
        response.send(items);
    };

    private getItemById = async (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        const item = await this.item.findById(id);
        if (item) {
            response.send(item);
        } else {
            next(new ItemNotFoundException(id));
        }
    };

    private modifyItem = async (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        const itemData: Item = request.body;
        const item = await this.item.findByIdAndUpdate(id, itemData, { new: true });
        if (item) {
            response.send(item);
        } else {
            next(new ItemNotFoundException(id));
        }
    };

    private createItem = async (request: RequestWithUser, response: Response) => {
        const itemData: CreateItemDto = request.body;
        const createdItem = new this.item({
            ...itemData,
            author: request.user._id,
        });
        const savedItem = await createdItem.save();
        await savedItem.populate("author", "-password");
        response.send(savedItem);
    };

    private deleteItem = async (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        const successResponse = await this.item.findByIdAndDelete(id);
        if (successResponse) {
            response.send(200);
        } else {
            next(new ItemNotFoundException(id));
        }
    };
}

export default ItemController;
