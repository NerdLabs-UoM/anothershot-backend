import { IsOptional, IsString } from "class-validator";

export class deleteEventDto{
    @IsString()
    id: string;
  
    @IsString()
    bookingId: string;

    // @IsString()
    // @IsOptional()
    // photographerId: string;
}