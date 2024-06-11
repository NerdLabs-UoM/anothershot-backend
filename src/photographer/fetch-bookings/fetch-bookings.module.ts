import { Module } from '@nestjs/common';
import { FetchBookingsService } from './fetch-bookings.service';
import { FetchBookingsController } from './fetch-bookings.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from "@nestjs/jwt";
import { NotifyService } from "src/notification/notify.service";
import { AppGateway } from "src/app.gateway";
@Module({
  controllers: [FetchBookingsController],
  providers: [FetchBookingsService , PrismaService, JwtService,NotifyService,AppGateway],
})
export class FetchBookingsModule {}
