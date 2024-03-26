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
}


export class AlbumImagesDto {
  @IsString()
  @IsNotEmpty()
  albumId: string;

  @IsArray()
  @IsString({ each: true })
  images: string[];
}