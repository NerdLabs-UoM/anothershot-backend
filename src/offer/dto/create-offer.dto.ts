import { UserRole } from "@prisma/client";
import { Type } from "class-transformer";
import { IsDate, IsEmail, IsNumber, IsString } from "class-validator";

export class CreateOfferDto {

    @IsString()
    clientId:string                      
               
    @IsString()
    photographerId:string          
                 
    @IsString()
    bookingsId:string 

    @IsString()
    description:string

    @IsString()
    packageName :string

    @IsString()
    clientName:string

    @IsNumber()
    price:number

    @IsDate()
    @Type(() => Date)
    date: Date;
}


