import { UserRole } from "@prisma/client";
import { Type } from "class-transformer";
import { IsDate, IsEmail, IsNumber, IsString } from "class-validator";


export class CreateBookingDto{
    @IsString()
    id: string;

    @IsString()
    clientId: string;

    @IsString()
    photographerId: string;

    @IsString()
    bookingsId: string;

    @IsString()
    description: string;

    @IsString()
    packageName: string;

    @IsString()
    clientName: string;

    @IsString()
    price: number;

    @IsDate()
    @Type(() => Date)
    date: Date;
}