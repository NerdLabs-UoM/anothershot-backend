import {  IsBoolean, IsDate,  IsOptional, IsString } from "class-validator";

export class createEventDto{
   
    
    @IsString()
    name: string;

    @IsString()
    bookingId: string;

    @IsString()
    description:string;
    
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