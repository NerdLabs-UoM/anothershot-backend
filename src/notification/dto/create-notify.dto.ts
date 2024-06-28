import { IsString, IsBoolean, IsDate } from 'class-validator';

export class CreateNotifyDto {
  @IsString()
  senderId: string;

  @IsString()
  receiverId: string;

  @IsString()
  type: string;

  @IsString()
  title: string;

  @IsString()
  description?: string;
}

export class SendNotifyDto {
  @IsString()
  id: string;

  @IsString()
  receiverId: string;

  @IsString()
  type: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsBoolean()
  read: boolean;

  @IsDate()
  createdAt: Date;
}

export class UpdateNotifyDto {
  @IsString()
  notifyId: string;

  // @IsString()
  // userId: string;

  @IsBoolean()
  read: boolean;
}
