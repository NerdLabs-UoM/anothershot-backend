import {  IsBoolean, IsOptional, IsString } from "class-validator";

export class updateEventDto{
    @IsString()
    eventId: string;
  
    @IsString()
    eventName: string;

    @IsString()
    bookingId: string;

    @IsString()
    @IsOptional()
    start: string;

    @IsString()
    @IsOptional()
    end: string;

    @IsBoolean()
    @IsOptional()
    allDay: boolean
    ;
}