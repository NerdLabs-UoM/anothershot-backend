import { IsString, IsOptional } from 'class-validator';
export class bankDetailsDto {
  @IsString()
  bankName: string;

  @IsString()
  accountNumber: string;

  @IsString()
  accountName: string;

  @IsString()
  accountBranch: string;

  @IsOptional()
  @IsString()
  accountBranchCode: string;
}
