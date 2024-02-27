import { IsString } from "class-validator";

export class ChatCreateDto {

    @IsString()
    senderId: string;

    @IsString()
    receiverId: string;

}