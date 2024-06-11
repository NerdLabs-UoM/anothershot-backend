import { Module } from '@nestjs/common';
import { FeaturedSectionService } from './featured-section.service';
import { FeaturedSectionController } from './featured-section.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from "@nestjs/jwt";
import { NotifyService } from "src/notification/notify.service";
import { AppGateway } from "src/app.gateway";

@Module({
  controllers: [FeaturedSectionController],
  providers: [FeaturedSectionService , PrismaService, JwtService,NotifyService,AppGateway],
})
export class FeaturedSectionModule {}
