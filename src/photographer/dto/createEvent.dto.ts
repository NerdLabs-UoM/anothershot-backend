import {  IsBoolean, IsDate,  IsDateString,  IsOptional, IsString } from "class-validator";

export class createEventDto{
       
    @IsString()
    name: string;

    @IsString()
    bookingId: string;

    @IsString()
    description:string;

    @IsDateString()
    startDate: string;

    @IsDateString()
    endDate: string;

    @IsString()
    start: string;

    @IsString()
    end: string;
        
    @IsBoolean()
    @IsOptional()
    allDay: boolean;


}