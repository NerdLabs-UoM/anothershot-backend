// AuthDto

import { IsEmail, IsString } from "class-validator";

// DTO for user login
export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}
