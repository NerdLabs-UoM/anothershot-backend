import { IsNumber, IsString } from 'class-validator';

export class CreateOfferDto {
  @IsString()
  clientId: string;

  @IsString()
  photographerId: string;

  @IsString()
  bookingsId: string;

  @IsString()
  description: string;

  @IsString()
  clientName: string;

  @IsNumber()
  price: number;
}
