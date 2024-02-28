import { IsOptional, IsString } from "class-validator";

export class createPackageDto {

    @IsString()
    photographerId: string;

    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsString({ each: true })       // use each:true for the string array - access to the each element in the array
    @IsOptional()
    coverPhotos: string[];

    @IsString()
    @IsOptional()
    price: string;

}