import { Address, SocialMedia } from "@prisma/client";
import { IsEmail, IsObject, IsOptional, IsString } from "class-validator";

export class contactDetailsDto {

    @IsString()
    userId: string;

    @IsString()
    phoneNum1: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsOptional()
    phoneNum2: string;

    @IsOptional()
    @IsObject()
    readonly address?: {
        street: string;
        city: string;
        state: string;
        country: string;
        zip: string;
    };

    @IsOptional()
    @IsObject()
    readonly socialMedia?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
        linkedin?: string;
        youtube?: string;
        tiktok?: string;
    };
}