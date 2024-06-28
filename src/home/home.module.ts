import { Module } from '@nestjs/common';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { PrismaService } from 'src/prisma/prisma.service';

// HomeModule
@Module({
  controllers: [HomeController],
  providers: [HomeService, PrismaService],
})
export class HomeModule {}
