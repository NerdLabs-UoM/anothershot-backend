import { IsString } from 'class-validator';
export class DeleteFeedDto {
    @IsString()
    feedId: string;
}