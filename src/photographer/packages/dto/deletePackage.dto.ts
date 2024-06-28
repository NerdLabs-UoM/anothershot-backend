import { IsString } from 'class-validator';

export class deletePackageDto {
  @IsString()
  photographerId: string;

  @IsString()
  packageId: string;
}
