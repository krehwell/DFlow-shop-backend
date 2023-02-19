import { IsString } from "class-validator";

class CreateItemDto {
    @IsString()
    public content: string;

    @IsString()
    public title: string;
}

export default CreateItemDto;
