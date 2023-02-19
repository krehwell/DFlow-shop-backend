import { Request, Response, NextFunction, Router } from "express";
import NotFoundException from "../exceptions/NotFoundException";
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
        const items = await this.item.find();
        response.send(items);
    };

    private getItemById = async (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        const item = await this.item.find({ id: id });
        if (item.length) {
            response.send(item[0]);
        } else {
            next(new NotFoundException("Item", id));
        }
    };

    private modifyItem = async (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        const itemData: Item = request.body;
        const item = await this.item.findOneAndUpdate({ id }, itemData, { new: true });
        if (item) {
            response.send(item);
        } else {
            next(new NotFoundException("Item", id));
        }
    };

    private createItem = async (request: RequestWithUser, response: Response) => {
        const itemData: CreateItemDto = request.body;
        const createdItem = new this.item({ ...itemData });
        createdItem.id = createdItem._id;
        const savedItem = await createdItem.save();
        response.send(savedItem);
    };

    private deleteItem = async (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        const successResponse = await this.item.findOneAndDelete({ id });
        if (successResponse) {
            response.send(204);
        } else {
            next(new NotFoundException("Item", id));
        }
    };
}

export default ItemController;
