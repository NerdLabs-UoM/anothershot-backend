import { IsArray, IsOptional, IsString } from "class-validator";

export class MessageSendDto {
    @IsString()
    senderId: string;

    @IsString()
    receiverId: string;

    @IsString()
    message: string;

    @IsString()
    chatId: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    attachments?: string[];
}