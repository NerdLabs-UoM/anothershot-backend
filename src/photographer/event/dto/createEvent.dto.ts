import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class createEventDto {
  @IsString()
  title: string;

  @IsString()
  bookingId: string;

  @IsString()
  description: string;

  @IsDateString()
  start: string;

  @IsDateString()
  end: string;

  @IsBoolean()
  @IsOptional()
  allDay: boolean;
}
