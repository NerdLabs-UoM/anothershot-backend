import { BookingStatus, PhotographerCategory } from "@prisma/client";
import {  IsEnum, IsOptional, IsString } from "class-validator";

export class createBookingDto {
   
    @IsString()
    photographerId: string;

    @IsString()
    clientId: string;

    // @IsString()
    // @IsOptional()
    // subject: string;

    @IsEnum(PhotographerCategory)
    category: PhotographerCategory;

    @IsString()
    packageId: string;

    @IsEnum(BookingStatus)
    status: BookingStatus;
}