import {  IsBoolean, IsDate,  IsOptional, IsString } from "class-validator";

export class createEventDto{
   
    
    @IsString()
    eventName: string;

    @IsString()
    bookingId: string;

    @IsDate()
    @IsOptional()
    start: Date;

    @IsDate()
    @IsOptional()
    end: Date;

    @IsBoolean()
    @IsOptional()
    allDay: boolean;


}