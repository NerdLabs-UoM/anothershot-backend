import { Module } from '@nestjs/common';
import { TestimonialService } from './testimonial.service';
import { TestimonialController } from './testimonial.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { NotifyService } from 'src/notification/notify.service';
import { AppGateway } from 'src/app.gateway';

@Module({
  controllers: [TestimonialController],
  providers: [
    TestimonialService,
    PrismaService,
    JwtService,
    NotifyService,
    AppGateway,
  ],
})
export class TestimonialModule {}
