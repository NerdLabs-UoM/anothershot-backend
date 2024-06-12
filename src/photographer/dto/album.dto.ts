import { AlbumVisibility } from '@prisma/client';
import { IsString, IsNotEmpty, IsArray, IsOptional, IsNumber } from 'class-validator';

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

  @IsNumber()
  price:number;

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

  @IsNumber()
  @IsOptional()
  price:number;

}

export class AlbumImagesDto {
  @IsString()
  @IsNotEmpty()
  albumId: string;

  @IsArray()
  @IsString({ each: true })
  images: string[];
}

export class UpdateAlbumCoverDto {
  @IsString()
  @IsNotEmpty()
  albumId: string;
  
  @IsString()
  coverImage:string;
}