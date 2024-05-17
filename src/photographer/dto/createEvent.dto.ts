import {  IsBoolean, IsDate,  IsDateString,  IsOptional, IsString } from "class-validator";

export class createEventDto{
       
    @IsString()
    title: string;

    @IsString()
    bookingId: string;

    @IsString()
    description:string;

    @IsString()
    start: string;

    @IsString()
    end: string;
        
    @IsBoolean()
    @IsOptional()
    allDay: boolean;


}