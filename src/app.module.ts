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
import { AppGateway } from './app.gateway';
import { HomeModule } from './home/home.module';
import {OfferModule} from './offer/offer.module';
import {PaymentModule} from './payment/payment.module';
import {StripeModule} from './stripe/stripe.module';
import { NotifyModule } from './notification/notify.module';
import { ReportModule } from './report/report.module';
@Module({
  imports: [ConfigModule.forRoot(), UserModule, AuthModule, AdminModule, PhotographerModule, ClientModule, ChatModule, HomeModule ,OfferModule ,PaymentModule, StripeModule,NotifyModule, ReportModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, AppGateway],
})
export class AppModule { }
