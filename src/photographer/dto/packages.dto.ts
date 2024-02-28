import { Address, BookingStatus, Package, PhotographerCategory, SocialMedia } from "@prisma/client";
import { IsEmail, IsNumber, IsObject, IsOptional, IsString } from "class-validator";

export class packagesDto {

    @IsString()
    userId: string;

    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsString()
    coverPhotos: string[];

    @IsNumber()
    price: number;

    @IsObject()
    readonly Booking?: {
        subject?: string;
        category?: PhotographerCategory;
        package?:Package;
        packageId?:string;
        date?:Date;
        start?:Date;
        end?:Date;
        status?:BookingStatus;
    };

}