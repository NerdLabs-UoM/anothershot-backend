import { IsString,IsBoolean } from "class-validator";

export class CreateNotifyDto {
    @IsString()
    receiverId: string;

    @IsString()
    type: string;

    @IsString()
    title: string;

    @IsString()
    description?: string;

}

export class UpdateNotifyDto {
    @IsString()
    id: string;

    @IsBoolean()
    read: boolean;
}