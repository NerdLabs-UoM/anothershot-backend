import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FetchBookingsService } from './fetch-bookings.service';

@Controller('api/photographer')
export class FetchBookingsController {
  private readonly logger = new Logger(FetchBookingsService.name);

  constructor(private readonly fetchBookingsService: FetchBookingsService) {}

  //------- booking controllers ---------

  @Get(':id/clientBookings')
  async getBookings(@Param('id') photographerId: string) {
    try {
      this.logger.log(
        `Fetching bookings for photographer ID: ${photographerId}`
      );
      const bookings =
        await this.fetchBookingsService.getBookings(photographerId);
      this.logger.log(
        `Bookings fetched successfully for photographer ID: ${photographerId}`
      );
      return bookings;
    } catch (error) {
      this.logger.error(
        `Error fetching bookings for photographer ID: ${photographerId}`,
        error.message
      );
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was a problem fetching the bookings.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
