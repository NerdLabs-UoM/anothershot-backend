import { ReportStatus } from '@prisma/client';
import { IsString } from 'class-validator';

export class SystemReportDto {
  @IsString()
  subject: string;

  @IsString()
  description: string;

}