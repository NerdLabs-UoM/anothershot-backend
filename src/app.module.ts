import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { AdminModule } from './admin/admin.module';
import { PhotographerController } from './photographer/photographer.controller';
import { PhotographerService } from './photographer/photographer.service';
import { PhotographerModule } from './photographer/photographer.module';
@Module({
  imports: [ConfigModule.forRoot(), UserModule, AuthModule, AdminModule, PhotographerModule],
  controllers: [AppController, PhotographerController],
  providers: [AppService, PrismaService, PhotographerService],
})
export class AppModule {}
