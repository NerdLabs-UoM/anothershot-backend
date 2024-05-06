import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDate } from 'class-validator';

export class EarningsDto {

  @IsString()
  @IsNotEmpty()
  photographerId: string;

  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;

  @IsNumber()
  @IsOptional()
  pending:number;

  @IsNumber()
  @IsOptional()
  fees: number;

  @IsDate()
  date: Date;

}
  

