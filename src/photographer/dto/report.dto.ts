import { ReportStatus } from '@prisma/client';
import { IsString } from 'class-validator';

export class ReportDto {

  @IsString()
  subject: string;

  @IsString()
  description: string;

}