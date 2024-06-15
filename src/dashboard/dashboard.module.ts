import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  controllers: [DashboardController],
  providers: [DashboardService , PrismaService, JwtService],
   imports: [DashboardModule],
})
export class DashboardModule {}
