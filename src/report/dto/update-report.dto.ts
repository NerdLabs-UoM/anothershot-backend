import { PartialType } from '@nestjs/mapped-types';
import { CreateReportDto } from './create-report.dto';
import { IsString } from 'class-validator';
import { ReportStatus } from '@prisma/client';

export class UpdateReportDto extends PartialType(CreateReportDto) {}

export class UpdateReportStatus {
  @IsString()
  status: ReportStatus;

  @IsString()
  ReportId: string;
}

export class UpdateImageReportStatus {
  @IsString()
  status: ReportStatus;

  @IsString()
  ImageReportId: string;
}
