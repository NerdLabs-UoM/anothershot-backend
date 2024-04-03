import { IsBoolean, IsString } from "class-validator";

export class FeedLikeDto {
    @IsString()
    feedId: string;

    @IsString()
    userId: string;

    @IsBoolean()
    like: boolean;
}