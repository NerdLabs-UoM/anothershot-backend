import { Module } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from "@nestjs/jwt";
import { NotifyService } from "src/notification/notify.service";
import { AppGateway } from "src/app.gateway";

@Module({
  controllers: [PackagesController],
  providers: [PackagesService,  PrismaService, JwtService,NotifyService,AppGateway],
})
export class PackagesModule {}
