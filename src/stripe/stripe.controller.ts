import {
  Controller,
  Post,
  Req,
  Headers,
  HttpStatus,
  RawBodyRequest,
  Body,
} from '@nestjs/common';
import { Stripe } from 'stripe';
import { Request } from 'express';
import { BookingStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { StripeService } from './stripe.service';
import { CreatePaymentDto } from 'src/stripe/dto/createPaymentDto';

@Controller('webhook')
export class StripeController {
  private readonly stripe: Stripe;

  constructor(private readonly prisma: PrismaService, private stripeService: StripeService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16', // your preferred Stripe API version
    });
  }

  @Post()
  async handleStripeEvent(
    @Headers('stripe-signature') signature: string,
    @Req() request: RawBodyRequest<Request>,
  ): Promise<any> {
    console.log('webhook funnction called');
    try {
      const event = await this.stripe.webhooks.constructEvent(
        request.rawBody.toString(),
        signature,
        process.env.WEBHOOK_SECRET,
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          console.log(
            `PaymentIntent for ${paymentIntent.amount} was successful!`,
          );
          break;
        case 'payment_method.attached':
          console.log("PaymentMethod")
          break;
        case 'checkout.session.completed':
          const checkoutSession = event.data.object;
          console.log(checkoutSession.metadata.bookingId);
          try {
            await this.prisma.booking.update({
              where: {
                id: checkoutSession.metadata.bookingId,
              },
              data: {
                status: BookingStatus.COMPLETED,
              },
            });

            const bookingDetails = await this.prisma.booking.findUnique({
              where: {
                id: checkoutSession.metadata.bookingId,
              },
            })
        
            await this.prisma.payment.create({
              data: {
                clientId: bookingDetails.clientId,
                photographerId:bookingDetails.photographerId ,
                bookingsId: checkoutSession.metadata.bookingId,
                amount: checkoutSession.amount_total,
                currency: checkoutSession.currency,
              },
            });

          } catch (e) {
            return HttpStatus.BAD_REQUEST;
          }
          console.log(`Checkout session ${checkoutSession.id} completed.`);
          break;
        default:
          // Unexpected event type
          console.log(`Unhandled event type ${event.type}.`);
      }
    } catch (error) {
      console.log(`⚠️  Webhook signature verification failed.`, error.message);
      return HttpStatus.BAD_REQUEST;
    }

    // Return a 200 response to acknowledge receipt of the event
    return HttpStatus.OK;
  }


  //testing API (delete after)
  @Post('create-payment')
  async create(@Body() dto:CreatePaymentDto ) {
    console.log(dto)
    return await this.stripeService.CreatePayment(dto);
  }
}
