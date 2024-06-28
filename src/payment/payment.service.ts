import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import Stripe from 'stripe';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePaymentStatusDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {
  private readonly stripe: Stripe;

  constructor(private readonly prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  //-----Payment Checkout Services ------

  //Get the Current Booking
  async getBooking(bookingId: string) {
    const booking = await this.stripe.checkout.sessions.retrieve(bookingId);
    return booking;
  }

  // Ceate a Checkout Session
  async createCheckoutSession(data: any) {
    const session = await this.stripe.checkout.sessions.create({
      metadata: {
        bookingId: data.bookingId,
      },
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: data.currency,
            product_data: {
              name: data.name,
            },
            unit_amount: data.price,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.BASE_URL}/user/client/${data.clientId}/bookings/checkout/success`,
      cancel_url: `${process.env.BASE_URL}/user/client/${data.clientId}/bookings/checkout/error`,
    });

    return session.url;
  }

  async createCheckoutSessionAlbum(data: any) {
    const session = await this.stripe.checkout.sessions.create({
      metadata: {
        albumId: data.albumId,
        clientId: data.clientId,
      },

      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: data.currency,
            product_data: {
              name: data.name,
            },
            unit_amount: data.price,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.BASE_URL}/success`,
      cancel_url: `${process.env.BASE_URL}/error`,
    });

    return session.url;
  }

  async SuccessSession(Session) {
    console.log(Session);
  }

  async createPaymentIntent(items: CreatePaymentDto) {
    const amount = this.calculateOrderAmount(items);
    console.log(items);
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',

      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  }

  private calculateOrderAmount(items: CreatePaymentDto): number {
    return items.amount * 100;
  }

  //------Admin Panel Payment Handling Services --------

  async getAllPayments() {
    const payments = await this.prisma.payment.findMany({
      include: {
        photographer: {
          include: {
            user: true,
          },
        },
        client: {
          include: {
            user: true,
          },
        },
      },
    });
    return payments;
  }

  async getPaymentById(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: {
        id: id,
      },
      include: {
        photographer: {
          include: {
            user: true,
            BankDetails: true,
          },
        },
        client: {
          include: {
            user: true,
          },
        },
      },
    });
    return payment;
  }

  async updatePaymentStatus(paymentId: string, data: UpdatePaymentStatusDto) {
    //select payment by id
    const payment = await this.prisma.payment.findUnique({
      where: {
        id: paymentId,
      },
    });

    if (!payment) {
      throw new Error(`payment with id not found`);
    } else {
      const paymentUpdate = await this.prisma.payment.update({
        where: {
          id: paymentId,
        },
        data: {
          status: data.status,
        },
      });
      return paymentUpdate;
    }
  }

  //-- find all users page by page --

  async findall(page: number, name: string) {
    const pageSize = 4;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    let whereClause = {}; //where to get search results

    if (name) {
      whereClause = {
        photographer: {
          user: {
            userName: {
              contains: name,
              mode: 'insensitive',
            },
          },
        },
      }; // If name is provided, filter by photographer user-name
    }

    const values = await this.prisma.payment.findMany({
      skip, //how many rows to skip
      take, //how many rows to get /fetch
      where: whereClause,
      include: {
        photographer: {
          include: {
            user: true,
          },
        },
        client: {
          include: {
            user: true,
          },
        },
      },
    });
    return values;
  }

  async findLastPage(name: string, roles: string) {
    const pageSize = 4;
    let whereClause = {};

    const rolesArray = roles ? roles.split(',') : null;

    if (name) {
      whereClause = {
        photographer: {
          user: {
            userName: {
              contains: name,
              mode: 'insensitive',
            },
          },
        },
      };
    }
    if (roles) {
      whereClause = { ...whereClause, userRole: { in: rolesArray } };
    }

    const total = await this.prisma.user.count({
      where: whereClause,
    });
    const lastPage = Math.ceil(total / pageSize);
    return lastPage;
  }
}
