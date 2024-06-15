import { PrismaService } from 'src/prisma/prisma.service';
import {
  PhotographerCategory,
} from '@prisma/client';
import {
  Injectable,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ClientBookingDto } from '../dto/clientBooking.dto';


@Injectable()
export class BookingCreateService {
  private readonly logger = new Logger(BookingCreateService.name);

  constructor(
    private prisma: PrismaService,
  ) {}

  
  // ------- booking creation services ---------

  //Fetches the categories of bookings for a specific photographer and converts them to lowercase.

  async getBookingsCategory(id: string) {
    try {
      this.logger.log(
        `Fetching bookings categories for photographer with user ID: ${id}`,
      );

      const bookings = await this.prisma.photographer.findMany({
        where: {
          userId: id,
        },
        select: {
          category: true,
        },
      });

      if (bookings.length === 0) {
        this.logger.warn(
          `No bookings found for photographer with user ID: ${id}`,
        );
      }

      const lowercaseCategories = bookings.map((booking) => ({
        category: booking.category.map((category) => category.charAt(0) + category.slice(1).toLowerCase()),
      }));

      this.logger.log(
        `Successfully fetched and converted categories to lowercase for user ID: ${id}`,
      );
      return lowercaseCategories;
    } catch (error) {
      this.logger.error(
        `Failed to fetch bookings categories for user ID: ${id}`,
        error.stack,
      );
      throw new HttpException(
        'Failed to fetch bookings categories',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  //Fetches the booking packages for a specific photographer
   
  async getBookingsPackage(id: string) {
    try {
      this.logger.log(`Fetching booking packages for photographer with ID: ${id}`);

      const packages = await this.prisma.package.findMany({
        where: {
          photographerId: id,
        },
        select: {
          id: true,
          name: true,
        },
      });

      if (packages.length === 0) {
        this.logger.warn(`No booking packages found for photographer with ID: ${id}`);
      }

      this.logger.log(`Successfully fetched booking packages for photographer with ID: ${id}`);
      return packages;
    } catch (error) {
      this.logger.error(`Failed to fetch booking packages for photographer with ID: ${id}`, error.stack);
      throw new HttpException('Failed to fetch booking packages', HttpStatus.NOT_FOUND);
    }
  }

  //Creates a new booking for a client
  
  async clientBooking(dto: ClientBookingDto) {
    try {
      this.logger.log(`Creating booking for client ID: ${dto.clientId} and photographer ID: ${dto.photographerId}`);

      const newBooking = await this.prisma.booking.create({
        data: {
          client: {
            connect: {
              userId: dto.clientId,
            },
          },
          photographer: {
            connect: {
              userId: dto.photographerId,
            },
          },
          subject: dto.eventName,
          start: dto.start,
          end: dto.end,
          location: dto.eventLocation,
          category:
            PhotographerCategory[
              dto.category.toUpperCase() as keyof typeof PhotographerCategory
            ],
          package: {
            connect: {
              id: dto.packageId,
            },
          },
        },
      });

      this.logger.log(`Successfully created booking for client ID: ${dto.clientId} and photographer ID: ${dto.photographerId}`);
      return newBooking;
    } catch (error) {
      this.logger.error(`Failed to create booking for client ID: ${dto.clientId} and photographer ID: ${dto.photographerId}`, error.stack);
      throw new HttpException('Failed to create booking', HttpStatus.BAD_REQUEST);
    }
  }

}
