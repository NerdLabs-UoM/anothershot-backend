// Message DTO

import { Attachment } from "@prisma/client";
import { IsArray, IsOptional, IsString } from "class-validator";

// DTO for sending a message
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
