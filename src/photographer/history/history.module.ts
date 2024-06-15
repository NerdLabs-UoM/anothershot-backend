import { Module } from '@nestjs/common';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { NotifyService } from "src/notification/notify.service";
import { AppGateway } from "src/app.gateway";

@Module({
  controllers: [HistoryController],
  providers: [HistoryService, PrismaService, JwtService,NotifyService,AppGateway]
})
export class HistoryModule {}
