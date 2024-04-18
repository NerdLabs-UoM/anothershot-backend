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
    startDate: string;

    @IsDateString()
    endDate: string;

    @IsString()
    startTime: string;

    @IsString()
    endTime: string;

    @IsString()
    category: string;

    @IsString()
    packageId: string;

   
}