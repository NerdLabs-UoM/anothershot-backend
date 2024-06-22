import { SystemReportStatus } from '@prisma/client';
import { IsString } from 'class-validator';

export class UpdateSystemReportStatus {
  @IsString()
  id: string;

  @IsString()
  status: SystemReportStatus;
}
