// SystemReportDto
import { IsString } from 'class-validator';

export class SystemReportDto {
  @IsString()
  subject: string;

  @IsString()
  description: string;
}
