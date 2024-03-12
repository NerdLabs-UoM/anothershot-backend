import { IsString, IsNotEmpty, IsArray } from 'class-validator';

export class AlbumsDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  photographerId: string;

  @IsString({ each: true })
  @IsArray()
  images: {
    image: string;
    caption?: string;
  };
}