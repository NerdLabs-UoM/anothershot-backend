import { IsNumber, IsOptional, IsString } from "class-validator";

export class updatePackageDto {

    @IsString()
    packageId: string;

    @IsString()
    photographerId: string;

    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsString({ each: true })
    @IsOptional()
    coverPhotos: string[];

    @IsNumber()
    price: number;

}