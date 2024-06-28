import { Module } from '@nestjs/common';
import { OfferService } from './offer.service';
import { OfferController } from './offer.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [OfferController],
  providers: [OfferService, PrismaService],
})
export class OfferModule {}
