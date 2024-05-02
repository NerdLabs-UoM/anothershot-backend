import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Booking, Offer,BookingStatus } from '@prisma/client';
import { CreateBookingDto } from './dto/create-booking';

@Injectable()
export class OfferService {
  constructor(private prisma: PrismaService) {}

  async createOffer(data:CreateOfferDto){
    const existingOffer = await this.prisma.offer.findFirst({
      where: {
        clientId: data.clientId,
        photographerId: data.photographerId,
        bookingsId: data.bookingsId,
      },
    })
    await this.prisma.booking.update({
      where:{
        id: data.bookingsId
      },
      data:{
        status: BookingStatus.CONFIRMED,
      }
    })
    
    if(existingOffer){
      return await this.updateOffer(existingOffer.id, data);
    }else{
      return await this.prisma.offer.create({
        data
      })
    }

    
  }

  async updateOffer(id: string, data: UpdateOfferDto){
    return await this.prisma.offer.update({
      where: {
        id: id
      },
      data: {
        ...data
      }
    })
  }

  async findAll(bookingId: string) {
    return await this.prisma.offer.findMany(
      {
        where:{
          bookingsId: bookingId
        }
      }
    );
  }

  async getOfferbyBookingId(bookingId: string) {
    try{
      const offer = await this.prisma.offer.findUnique({
        where: {
          bookingsId: bookingId,
        },
      });
      if (!offer) {
        throw new NotFoundException(`Offer not found`);
      }
      return offer;
    }
       catch(err){
        return err
       }
  }

  async getOfferbyPhotographer(id: string) {
      const offer = await this.prisma.offer.findMany({
        where: {
          photographerId: id,
        },
      });
      return offer
    }

  async getOffersbyClientId(id: string) {
    return await this.prisma.offer.findMany({
      where:{
        clientId:id
      }
    })
  }

  async deleteOfferbyBookingId(bookingId: string){
    const offer = await this.prisma.offer.findUnique({
      where: {
        bookingsId: bookingId,
      },
    });
    if(!offer){
      throw new NotFoundException(`offer not found`)
    }
    await this.prisma.offer.delete({
      where: {
        bookingsId: bookingId,
      },
    });
  }

  async createBooking(data: Booking){
    return await this.prisma.booking.create({
      data
    })
  }

  create(createOfferDto: CreateOfferDto) {
    return 'This action adds a new offer';
  }



  findOne(id: number) {
    return `This action returns a #${id} offer`;
  }

  update(id: number, updateOfferDto: UpdateOfferDto) {
    return `This action updates a #${id} offer`;
  }

  remove(id: number) {
    return `This action removes a #${id} offer`;
  }
}
