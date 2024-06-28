// Chat DTO

import { IsString } from 'class-validator';

// DTO for creating a chat
export class ChatCreateDto {
  @IsString()
  senderId: string;

  @IsString()
  receiverId: string;
}
