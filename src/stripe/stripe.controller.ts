import {
  Controller,
  Post,
  Req,
  Headers,
  HttpStatus,
  RawBodyRequest,
  Logger,
  InternalServerErrorException,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { Stripe } from 'stripe';
import { Request } from 'express';
import { BookingStatus, PaymentStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { StripeService } from './stripe.service';
import { NotifyService } from '../notification/notify.service';

@Controller('webhook')
export class StripeController {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(StripeController.name);

  constructor(
    private readonly prisma: PrismaService,
    private stripeService: StripeService,
    private notificationService: NotifyService
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16', // your preferred Stripe API version
    });
  }

  @Post()
  async handleStripeEvent(
    @Headers('stripe-signature') signature: string,
    @Req() request: RawBodyRequest<Request>
  ): Promise<any> {
    this.logger.log('Webhook function called');
    let event;

    try {
      event = await this.stripe.webhooks.constructEvent(
        request.rawBody.toString(),
        signature,
        process.env.WEBHOOK_SECRET
      );
    } catch (error) {
      this.logger.error(
        '⚠️  Webhook signature verification failed.',
        error.message
      );
      throw new BadRequestException('Webhook signature verification failed');
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        this.logger.log(
          `PaymentIntent for ${paymentIntent.amount} was successful`
        );
        break;

      case 'payment_method.attached':
        this.logger.log('PaymentMethod attached');
        break;

      case 'checkout.session.completed':
        const checkoutSession = event.data.object;
        this.logger.log(
          `Checkout session completed with metadata: ${JSON.stringify(
            checkoutSession.metadata
          )}`
        );

        if (checkoutSession.metadata.bookingId != null) {
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
            });

            await this.prisma.payment.create({
              data: {
                clientId: bookingDetails.clientId,
                photographerId: bookingDetails.photographerId,
                bookingsId: checkoutSession.metadata.bookingId,
                amount: checkoutSession.amount_total/100,
                currency: checkoutSession.currency,
              },
            });
            this.logger.log(
              `Payment for Booking with ID ${checkoutSession.metadata.bookingId} completed successfully`
            );

            try {
              const newNotification =
                await this.notificationService.createNotification({
                  senderId: bookingDetails.clientId,
                  receiverId: bookingDetails.photographerId,
                  type: 'Payment',
                  title: `has Payed the ${checkoutSession.amount_total/100}`,
                  description: 'Payment has been made for the booking.',
                });
              this.logger.log(
                `Successfully created notification with ID: ${newNotification.id}`
              );
            } catch (error) {
              this.logger.error(`Failed to create notification`, error.stack);
              throw new HttpException(
                'Failed to create notification',
                HttpStatus.INTERNAL_SERVER_ERROR
              );
            }
          } catch (error) {
            this.logger.error('Failed to process booking payment', error.stack);
            throw new InternalServerErrorException(
              'Failed to process booking payment'
            );
          }
        } else if (checkoutSession.metadata.albumId != null) {
          try {
            await this.prisma.album.update({
              where: {
                id: checkoutSession.metadata.albumId,
              },
              data: {
                paymentStatus: PaymentStatus.PAID,
              },
            });

            const albumDetails = await this.prisma.album.findUnique({
              where: {
                id: checkoutSession.metadata.albumId,
              },
            });

            await this.prisma.albumPayment.create({
              data: {
                clientId: checkoutSession.metadata.clientId,
                photographerId: albumDetails.photographerId,
                albumId: checkoutSession.metadata.albumId,
                amount: checkoutSession.amount_total/100,
                currency: checkoutSession.currency,
              },
            });

            this.logger.log(
              `Album payment with ID ${checkoutSession.metadata.albumId} processed successfully`
            );

            try {
              const newNotification =
                await this.notificationService.createNotification({
                  senderId: checkoutSession.metadata.clientId,
                  receiverId: albumDetails.photographerId,
                  type: 'Payment',
                  title: `has Payed the ${checkoutSession.amount_total/100}`,
                  description: 'Payment has been made for the booking.',
                });
              this.logger.log(
                `Successfully created notification with ID: ${newNotification.id}`
              );
              return newNotification;
            } catch (error) {
              this.logger.error(`Failed to create notification`, error.stack);
              throw new HttpException(
                'Failed to create notification',
                HttpStatus.INTERNAL_SERVER_ERROR
              );
            }
          } catch (error) {
            this.logger.error('Failed to process album payment', error.stack);
            throw new InternalServerErrorException(
              'Failed to process album payment'
            );
          }
        }
        break;

      default:
        this.logger.warn(`Unhandled event type: ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    return HttpStatus.OK;
  }
}
