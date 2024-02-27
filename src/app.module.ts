import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { AdminModule } from './admin/admin.module';
import { PhotographerModule } from './photographer/photographer.module';
import { ClientModule } from './client/client.module';
import { ChatModule } from './chat/chat.module';
import { ChatGateway } from './chat/chat.gateway';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, AuthModule, AdminModule, PhotographerModule, ClientModule, ChatModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, ChatGateway],
})
export class AppModule { }
