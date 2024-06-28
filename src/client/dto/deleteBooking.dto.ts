import { IsString } from 'class-validator';

export class DeleteBookingDto {
  @IsString()
  bookingId: string;
}
