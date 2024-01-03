import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, AuthModule, AdminModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
