import { IsString } from 'class-validator';

export class CreateReportDto {
  @IsString()
  subject: string;

  @IsString()
  description: string;

  @IsString()
  clientId: string;

  @IsString()
  photographerId: string;
}


export class reportImageDto {
    @IsString()
    subject: string;
  
    @IsString()
    description: string;
  
    @IsString()
    userId: string;
  
    @IsString()
    feedImageId: string;
  }