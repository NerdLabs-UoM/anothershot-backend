import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StripeService {
  constructor(private prisma: PrismaService) {}

  async getBookingbyId(id: string) {
    const boooking = await this.prisma.booking.findUnique({
      where: {
        id: id,
      },
    });

    return boooking;
  }

  async CreatePayment(data: any) {
    return await this.prisma.payment.create({
      data,
    });
  }
}
