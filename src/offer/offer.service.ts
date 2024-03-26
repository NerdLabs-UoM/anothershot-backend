import { Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OfferService {
  constructor(private prisma: PrismaService) {}

  async createOffer(data:CreateOfferDto){
    return await this.prisma.offer.create({
      data: {
        clientId: data.clientId,
        photographerId: data.photographerId,
        bookingsId: data.bookingsId,
        description: data.description,
        packageName: data.packageName,
        clientName: data.clientName,
        price: data.price,
        date: data.date
      }
    })
  }

  create(createOfferDto: CreateOfferDto) {
    return 'This action adds a new offer';
  }

  findAll() {
    return `This action returns all offer`;
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
