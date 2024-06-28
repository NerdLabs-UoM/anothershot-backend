import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppGateway } from 'src/app.gateway';

// ChatModule
@Module({
  controllers: [ChatController],
  providers: [ChatService, PrismaService, AppGateway],
})
export class ChatModule {}
