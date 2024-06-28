import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Booking, BookingStatus } from '@prisma/client';

@Injectable()
export class OfferService {
  constructor(private prisma: PrismaService) {}

  async createOffer(data: CreateOfferDto) {
    const existingOffer = await this.prisma.offer.findFirst({
      where: {
        clientId: data.clientId,
        photographerId: data.photographerId,
        bookingsId: data.bookingsId,
      },
    });
    await this.prisma.booking.update({
      where: {
        id: data.bookingsId,
      },
      data: {
        status: BookingStatus.CONFIRMED,
      },
    });

    if (existingOffer) {
      return await this.updateOffer(existingOffer.id, data);
    } else {
      return await this.prisma.offer.create({
        data,
      });
    }
  }

  async updateOffer(id: string, data: UpdateOfferDto) {
    return await this.prisma.offer.update({
      where: {
        id: id,
      },
      data: {
        ...data,
      },
    });
  }

  async findAll(bookingId: string) {
    return await this.prisma.offer.findMany({
      where: {
        bookingsId: bookingId,
      },
    });
  }

  async getOfferbyBookingId(bookingId: string) {
    try {
      const offer = await this.prisma.offer.findUnique({
        where: {
          bookingsId: bookingId,
        },
      });
      if (!offer) {
        throw new NotFoundException(`Offer not found`);
      }
      return offer;
    } catch (err) {
      return err;
    }
  }

  async getOfferbyPhotographer(id: string) {
    const offer = await this.prisma.offer.findMany({
      where: {
        photographerId: id,
      },
    });
    return offer;
  }

  async getOffersbyClientId(id: string) {
    return await this.prisma.offer.findMany({
      where: {
        clientId: id,
      },
    });
  }

  async deleteOfferbyBookingId(bookingId: string) {
    const offer = await this.prisma.offer.findUnique({
      where: {
        bookingsId: bookingId,
      },
    });
    if (!offer) {
      throw new NotFoundException(`offer not found`);
    }
    await this.prisma.offer.delete({
      where: {
        bookingsId: bookingId,
      },
    });
  }

  async createBooking(data: Booking) {
    return await this.prisma.booking.create({
      data,
    });
  }

  async getBookings(photographerId: string) {
    return await this.prisma.booking.findMany({
      where: {
        photographerId: photographerId,
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
      },
      orderBy: {
        id: 'desc',
      },
    });
  }
}
