import { Module } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotifyService } from 'src/notification/notify.service';
import { AppGateway } from 'src/app.gateway';

@Module({
  controllers: [StripeController],
  providers: [StripeService, PrismaService, NotifyService, AppGateway],
})
export class StripeModule {}
