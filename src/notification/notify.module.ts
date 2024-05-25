import { Module } from '@nestjs/common';
import { NotifyService } from './notify.service';
import { NotifyController } from './notify.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppGateway } from 'src/app.gateway';

@Module({
    controllers: [NotifyController],
    providers: [NotifyService,PrismaService,AppGateway]
})

export class NotifyModule{}