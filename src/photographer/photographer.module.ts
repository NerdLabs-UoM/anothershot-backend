import { Module } from "@nestjs/common";
import { PhotographerService } from "./photographer.service";
import { PrismaService } from "src/prisma/prisma.service";
import { PhotographerController } from './photographer.controller';
import { JwtService } from "@nestjs/jwt";
import { NotifyService } from "src/notification/notify.service";
import { AppGateway } from "src/app.gateway";
import { TestimonialModule } from './testimonial/testimonial.module';
import { FeedModule } from './feed/feed.module';
import { BookingCreateModule } from './booking-create/booking-create.module';
import { HistoryModule } from './history/history.module';


@Module({
    controllers: [PhotographerController],
    providers: [PhotographerService, PrismaService, JwtService,NotifyService,AppGateway],
    imports: [TestimonialModule, FeedModule, BookingCreateModule, HistoryModule],
})

export class PhotographerModule { }
