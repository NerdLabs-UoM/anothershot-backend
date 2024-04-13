// import { IsOptional, IsString, IsEnum } from 'class-validator';
// import { PhotographerCategory, BookingStatus } from '@prisma/client';

// export class createBookingDto {
//   @IsString()
//   clientId: string;

//   @IsString()
//   photographerId: string;

//   @IsString()
//   subject: string;

//   @IsEnum(PhotographerCategory)
//   category: PhotographerCategory;

//   @IsString()
//   packageId: string;

//   @IsString()
//   @IsOptional()
//   payment?: string;

//   @IsString()
//   @IsOptional()
//   offerId?: string;

//   @IsString()
//   date: Date;

//   @IsString()
//   @IsOptional()
//   start?: Date;

//   @IsString()
//   @IsOptional()
//   end?: Date;

//   @IsString()
//   @IsOptional()
//   eventId?: string;

//   @IsEnum(BookingStatus)
//   status: BookingStatus;
// }
