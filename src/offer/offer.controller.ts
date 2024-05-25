import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { OfferService } from './offer.service';
import { CreateOfferDto} from './dto/create-offer.dto';
import { Booking } from '@prisma/client';

@Controller('api/offer')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @Post('create-offer')
  
  async create(@Body() dto: CreateOfferDto) {
    return await this.offerService.createOffer(dto);
  }

  @Get(':id')
  async get(@Param('id') bookingId:string){
    return this.offerService.getOfferbyBookingId(bookingId);
  }

  @Delete(':id/delete')
  async delete(@Param('id') id:string){
    return this.offerService.deleteOfferbyBookingId(id)
  }

  @Post('create-booking')
  async createBooking(@Body() dto:Booking){
    return this.offerService.createBooking(dto)
  }

  @Get(':id/all')
  async getOffers(@Param('id') id:string) {
    console.log(id);
    return this.offerService.findAll(id);
  }

  @Get(':id/photographer/offers')
  async getOfferbyPhotographer(@Param('id') id:string) {
    return this.offerService.getOfferbyPhotographer(id);
  }

  @Get(':id/client/offers')
  async getOfferbyClient(@Param('id') id:string){
    return this.offerService.getOffersbyClientId(id)
  }

  @Get(':id/photographerBookings')
    async getBookings(@Param('id') clientId: string) {
      return await this.offerService.getBookings(clientId);
    }

}
