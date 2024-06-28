import { Module } from '@nestjs/common';
import { PhotographerService } from './photographer.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PhotographerController } from './photographer.controller';
import { JwtService } from '@nestjs/jwt';
import { NotifyService } from 'src/notification/notify.service';
import { AppGateway } from 'src/app.gateway';
import { PackagesModule } from './packages/packages.module';
import { ContactSectionModule } from './contact-section/contact-section.module';
import { FeaturedSectionModule } from './featured-section/featured-section.module';
import { EventModule } from './event/event.module';
import { FetchBookingsModule } from './fetch-bookings/fetch-bookings.module';
import { TestimonialModule } from './testimonial/testimonial.module';
import { FeedModule } from './feed/feed.module';
import { BookingCreateModule } from './booking-create/booking-create.module';
import { HistoryModule } from './history/history.module';
import { AlbumsModule } from './albums/albums.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  controllers: [PhotographerController],
  providers: [
    PhotographerService,
    PrismaService,
    JwtService,
    NotifyService,
    AppGateway,
  ],
  imports: [
    PackagesModule,
    ContactSectionModule,
    FeaturedSectionModule,
    EventModule,
    FetchBookingsModule,
    TestimonialModule,
    FeedModule,
    BookingCreateModule,
    HistoryModule,
    AlbumsModule,
    SettingsModule,
  ],
})
export class PhotographerModule {}
