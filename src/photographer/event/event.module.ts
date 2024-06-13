import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from "@nestjs/jwt";
import { NotifyService } from "src/notification/notify.service";
import { AppGateway } from "src/app.gateway";
@Module({
  
  controllers: [EventController],
  providers: [EventService , PrismaService, JwtService,NotifyService,AppGateway],
})
export class EventModule {}
