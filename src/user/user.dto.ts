import { IsString } from "class-validator";

class CreateUserDto {
    @IsString()
    public username: string;

    @IsString()
    public password: string;
}

export default CreateUserDto;
