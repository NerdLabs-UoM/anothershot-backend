import { IsOptional, IsString } from "class-validator";

export class deleteEventDto{
    @IsString()
    eventId: string;
  
    @IsString()
    bookingId: string;

    @IsString()
    @IsOptional()
    photographerId: string;
}