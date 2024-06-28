import { IsString, IsNumber } from 'class-validator';
export class CreateTestimonialDto {
  @IsString()
  review: string;

  @IsNumber()
  rating: number;

  @IsString()
  clientId: string;

  @IsString()
  photographerId: string;
}
