import { IsString, IsNumber } from "class-validator";

class CreateItemDto {
    @IsString()
    public name: string;

    @IsNumber()
    public price: number;

    @IsNumber()
    public total: number;
}

export default CreateItemDto;
