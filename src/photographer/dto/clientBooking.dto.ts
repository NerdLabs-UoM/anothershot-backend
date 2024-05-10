import {  IsDateString, IsString } from "class-validator";

export class ClientBookingDto {
   
    @IsString()
    photographerId: string;

    @IsString()
    clientId: string;

    @IsString()
    eventName: string;

    @IsString()
    eventLocation: string;
    
    @IsDateString()
    start: string;

    @IsDateString()
    end: string;

    @IsString()
    category: string;

    @IsString()
    packageId: string;

   
}