import { Module } from '@nestjs/common';
import { NotifyService } from './notify.service';
import { NotifyController } from './notify.controller';
import { PrismaService } from 'src/prisma/prisma.service';


@Module({
    controllers: [NotifyController],
    providers: [NotifyService,PrismaService]
})

export class NotifyModule{}