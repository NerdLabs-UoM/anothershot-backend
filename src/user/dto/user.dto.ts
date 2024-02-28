import { UserRole } from "@prisma/client";
import { IsEmail, IsString } from "class-validator";

export class CreateUserDto {

    @IsEmail()
    email: string;

    @IsString()
    userName: string;

    @IsString()
    password: string;

    @IsString()
    userRole: UserRole;
}