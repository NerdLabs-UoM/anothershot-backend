import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { NotifyService } from 'src/notification/notify.service';
import { AppGateway } from 'src/app.gateway';
import { BookingCreateService } from './booking-create.service';
import { BookingCreateController } from './booking-create.controller';

@Module({
  providers: [
    BookingCreateService,
    PrismaService,
    JwtService,
    NotifyService,
    AppGateway,
  ],
  controllers: [BookingCreateController],
})
export class BookingCreateModule {}
