import { IsBoolean, IsString } from "class-validator";

export class FeedLikeDto {
    @IsString()
    feedId: string;

    @IsString()
    clientId: string;

    @IsBoolean()
    like: boolean;
}