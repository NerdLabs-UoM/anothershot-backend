import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Photographer } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FetchBookingsService {
  private readonly logger = new Logger(FetchBookingsService.name);

  constructor(
    private prisma: PrismaService,
    
  ) { }
//------- booking services ---------

async getBookings(photographerId: string) {
  try {
    this.logger.log(`Fetching bookings for photographer ID: ${photographerId}`);
    const bookings = await this.prisma.booking.findMany({
      where: {
        photographerId: photographerId
      },
      select: {
        id: true,
        subject: true,
        start: true,
        status: true,
        location: true,
        category: true,
        client: {
          select: {
            name: true,
            id: true,
          },
        },
        photographer: {
          select: {
            name: true,
          },
        },
        offer: {
          select: {
            price: true,
          },
        },
        package: {
          select: {
            name: true,
            price: true,
          },
        },
      }
    });
    this.logger.log(`Bookings fetched successfully for photographer ID: ${photographerId}`);
    return bookings;
  } catch (error) {
    this.logger.error(`Error fetching bookings for photographer ID: ${photographerId}`, error.message);
    throw new HttpException(
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'There was a problem fetching the bookings.',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}


// async getTotalUsers() {
//   const users = await this.prisma.user.count();
//   return users;
// }

async grtMonthlyBookings() {
  const total = await this.prisma.booking.groupBy({
    by: ['createdAt'],
    _count: {
      _all: true,
    },
  });

}
}

