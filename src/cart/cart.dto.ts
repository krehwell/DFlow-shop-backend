import "reflect-metadata";
import { IsNumber, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class CartItems {
    @IsString()
    public item: string;
    @IsNumber()
    public total: number;
}

class CreateCartDto {
    @ValidateNested({ each: true })
    @Type(() => CartItems)
    public items: CartItems[];
}

export default CreateCartDto;
