import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdminController } from './admin.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AdminController],
  providers: [AdminService, PrismaService, JwtService],
})
export class AdminModule {}
