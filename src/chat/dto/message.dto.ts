import { Attachment } from "@prisma/client";
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
    attachments?: Attachment[];
}