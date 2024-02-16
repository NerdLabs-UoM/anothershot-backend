import { Module } from '@nestjs/common';
import { PhotographerController } from './photographer.controller';
import { PhotographerService } from './photographer.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PhotographerController],
  providers: [PhotographerService, PrismaService]
})
export class PhotographerModule { }
