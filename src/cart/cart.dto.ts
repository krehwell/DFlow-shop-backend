import { IsString } from "class-validator";

class CreateCartDto {
    @IsString({ each: true })
    public items: string[];
}

export default CreateCartDto;
