// AppModule

import { Module, Logger } from '@nestjs/common';
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
import { OfferModule } from './offer/offer.module';
import { PaymentModule } from './payment/payment.module';
import { StripeModule } from './stripe/stripe.module';
import { NotifyModule } from './notification/notify.module';
import { ReportModule } from './report/report.module';
import { SettingsModule } from './photographer/settings/settings.module';
import { AlbumsModule } from './photographer/albums/albums.module';
import { DashboardModule } from './dashboard/dashboard.module';

const logger = new Logger('AppModule');

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    AuthModule,
    AdminModule,
    PhotographerModule,
    ClientModule,
    ChatModule,
    HomeModule,
    OfferModule,
    PaymentModule,
    StripeModule,
    NotifyModule,
    ReportModule,
    SettingsModule,
    AlbumsModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, AppGateway],
})
export class AppModule {
  constructor() {
    logger.log('AppModule initialized');
  }
}
