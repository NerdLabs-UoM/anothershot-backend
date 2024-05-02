import { UserRole } from "@prisma/client";
import { Type } from "class-transformer";
import { IsDate, IsEmail, IsNumber, IsString } from "class-validator";

export class CreatePaymentDto {

    @IsString()
    clientId:string                      
               
    @IsString()
    photographerId:string          
                 
    @IsString()
    bookingsId:string 


    @IsNumber()
    amount:number

    @IsString()
    currency:string
}
