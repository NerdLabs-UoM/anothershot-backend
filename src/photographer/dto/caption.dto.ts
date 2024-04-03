import { IsString } from 'class-validator';
export class CaptionDto {
    @IsString()
    feedId: string;

    @IsString()
    caption: string;
}