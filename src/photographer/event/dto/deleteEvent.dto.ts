import { IsString } from 'class-validator';

export class deleteEventDto {
  @IsString()
  id: string;
}
