import { IsString, IsNumber, IsOptional, IsISO8601 } from 'class-validator';

export class DashboardDto {
    @IsString()
    clientId: string;

    @IsOptional()
    @IsNumber()
    amount?: number;

    @IsOptional()
    @IsISO8601()
    createdAt?: string;

    @IsOptional()
    @IsString()
    userId?: string;
}
