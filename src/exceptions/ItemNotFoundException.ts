import HttpException from "./HttpException";

class ItemNotFoundException extends HttpException {
    constructor(id: string) {
        super(404, `Item with id ${id} not found`);
    }
}

export default ItemNotFoundException;
