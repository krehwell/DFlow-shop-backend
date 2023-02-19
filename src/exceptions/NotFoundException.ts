import HttpException from "./HttpException";

class NotFoundException extends HttpException {
    constructor(itemType: string, id: string) {
        super(404, `${itemType} with id ${id} not found`);
    }
}

export default NotFoundException;
