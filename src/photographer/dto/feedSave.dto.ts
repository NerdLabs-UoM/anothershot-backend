import { IsBoolean, IsString } from 'class-validator';

export class FeedSaveDto {
  @IsString()
  feedId: string;

  @IsString()
  userId: string;

  @IsBoolean()
  save: boolean;
}
