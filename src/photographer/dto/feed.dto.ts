import { IsString } from 'class-validator';
export class FeedDto {
  @IsString()
  image: string;

  @IsString()
  photographerId: string;
}
