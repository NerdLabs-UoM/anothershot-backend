import { IsBoolean, IsString } from "class-validator";

export class FeedSaveDto {
    @IsString()
    feedId: string;

    @IsString()
    clientId: string;

    @IsBoolean()
    save: boolean;
}