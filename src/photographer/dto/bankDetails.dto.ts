import { IsString, IsEnum, IsOptional } from 'class-validator';
export class bankDetailsDto {
  @IsString()
  userId: string;

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