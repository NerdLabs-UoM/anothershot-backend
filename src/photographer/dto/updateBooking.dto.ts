import { BookingStatus, PhotographerCategory } from "@prisma/client";
import {  IsEnum, IsOptional, IsString } from "class-validator";

export class updateBookingDto {
    @IsString()
    bookingId: string;

    @IsString()
    photographerId: string;

    @IsString()
    clientId: string;

    @IsString()
    subject: string;

    @IsEnum(PhotographerCategory)
    category: PhotographerCategory;

    @IsString()
    packageId: string;

    @IsEnum(BookingStatus)
    status: BookingStatus;
}