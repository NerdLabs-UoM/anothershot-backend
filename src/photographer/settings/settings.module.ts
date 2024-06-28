import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AppGateway } from 'src/app.gateway';

@Module({
  controllers: [SettingsController],
  providers: [SettingsService, PrismaService, JwtService, AppGateway],
})
export class SettingsModule {}
