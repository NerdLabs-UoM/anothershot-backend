import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ClientImageDto, ClientDto } from './dto/client.dto';
import { DeleteBookingDto } from './dto/deleteBooking.dto';

@Injectable()
export class ClientService {
  private readonly logger = new Logger(ClientService.name);

  constructor(private prisma: PrismaService) {}

  // Update client's profile image

  async updateImage(dto: ClientImageDto) {
    this.logger.log(`Updating image for client with ID: ${dto.clientId}`);
    try {
      const result = await this.prisma.user.update({
        where: {
          id: dto.clientId,
        },
        data: {
          image: dto.image,
        },
      });
      this.logger.log(
        `Image updated successfully for client with ID: ${dto.clientId}`
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to update image for client with ID: ${dto.clientId}`,
        error.stack
      );
      throw new HttpException('Failed to update image', HttpStatus.BAD_REQUEST);
    }
  }

  // Update client's profile

  async updateProfile(dto: ClientDto) {
    this.logger.log(`Updating profile for client with ID: ${dto.clientId}`);
    try {
      const result = await this.prisma.client.update({
        where: {
          userId: dto.clientId,
        },
        data: {
          name: dto.name,
          bio: dto.bio,
        },
      });
      this.logger.log(
        `Profile updated successfully for client with ID: ${dto.clientId}`
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to update profile for client with ID: ${dto.clientId}`,
        error.stack
      );
      throw new HttpException(
        'Failed to update profile',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // Get client details by ID

  async getClientDetails(id: string) {
    this.logger.log(`Fetching details for client with ID: ${id}`);
    try {
      const result = await this.prisma.client.findUnique({
        where: {
          userId: id,
        },
        select: {
          name: true,
          bio: true,
          user: {
            select: {
              image: true,
              userName: true,
            },
          },
        },
      });
      this.logger.log(`Fetched details successfully for client with ID: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to fetch details for client with ID: ${id}`,
        error.stack
      );
      throw new HttpException(
        'Failed to fetch client details',
        HttpStatus.NOT_FOUND
      );
    }
  }

  // Get liked images by client ID

  async getLikedImages(id: string) {
    this.logger.log(`Fetching liked images for client with ID: ${id}`);
    try {
      const result = await this.prisma.user.findMany({
        where: {
          id: id,
        },
        select: {
          likedFeedImages: {
            select: {
              id: true,
              imageUrl: true,
              photographerId: true,
            },
          },
        },
      });
      this.logger.log(
        `Fetched liked images successfully for client with ID: ${id}`
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to fetch liked images for client with ID: ${id}`,
        error.stack
      );
      throw new HttpException(
        'Failed to fetch liked images',
        HttpStatus.NOT_FOUND
      );
    }
  }

  // Get saved images by client ID

  async getSavedImages(id: string) {
    this.logger.log(`Fetching saved images for client with ID: ${id}`);
    try {
      const result = await this.prisma.user.findMany({
        where: {
          id: id,
        },
        select: {
          savedFeedImages: {
            select: {
              id: true,
              imageUrl: true,
              photographerId: true,
            },
          },
        },
      });
      this.logger.log(
        `Fetched saved images successfully for client with ID: ${id}`
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to fetch saved images for client with ID: ${id}`,
        error.stack
      );
      throw new HttpException(
        'Failed to fetch saved images',
        HttpStatus.NOT_FOUND
      );
    }
  }

  // Get bookings by client ID

  async getBookings(clientId: string) {
    this.logger.log(`Fetching bookings for client with ID: ${clientId}`);
    try {
      const result = await this.prisma.booking.findMany({
        where: {
          clientId: clientId,
        },
        select: {
          id: true,
          subject: true,
          category: true,
          start: true,
          status: true,
          location: true,
          client: {
            select: {
              name: true,
            },
          },
          photographer: {
            select: {
              name: true,
              userId: true,
              user: {
                select: {
                  image: true,
                },
              },
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
            },
          },
          clientId: true,
          end: true,
        },
        orderBy: {
          id: 'desc',
        },
      });
      this.logger.log(
        `Fetched bookings successfully for client with ID: ${clientId}`
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to fetch bookings for client with ID: ${clientId}`,
        error.stack
      );
      throw new HttpException('Failed to fetch bookings', HttpStatus.NOT_FOUND);
    }
  }

  // Delete a booking by booking ID

  async deleteBooking(dto: DeleteBookingDto) {
    this.logger.log(`Deleting booking with ID: ${dto.bookingId} for client`);
    try {
      const result = await this.prisma.booking.delete({
        where: {
          id: dto.bookingId,
        },
      });
      this.logger.log(`Booking deleted successfully with ID: ${dto.bookingId}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to delete booking with ID: ${dto.bookingId} for client`,
        error.stack
      );
      throw new HttpException(
        'Failed to delete booking',
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
