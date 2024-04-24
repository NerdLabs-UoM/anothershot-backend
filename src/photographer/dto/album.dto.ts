import { AlbumVisibility } from '@prisma/client';
import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

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

  @IsString()
  @IsOptional()
  visibility:AlbumVisibility;

}

export class updateAlbumDto {
  @IsString()
  @IsNotEmpty()
  albumId: string;

  @IsString()
  @IsNotEmpty()
  name:string;

  @IsString()
  @IsNotEmpty()
  description:string;

  @IsString()
  @IsOptional()
  visibility:AlbumVisibility;
}

export class AlbumImagesDto {
  @IsString()
  @IsNotEmpty()
  albumId: string;

  @IsArray()
  @IsString({ each: true })
  images: string[];
}