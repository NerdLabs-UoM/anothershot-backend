import { IsString } from 'class-validator';
export class FeedDto {
    // @IsString()
    // caption: string;

    @IsString()
    image: string;

    @IsString()
    photographerId: string;
}