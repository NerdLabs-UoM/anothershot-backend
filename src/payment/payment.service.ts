import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {

  private readonly stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16', 
    });
  }
  //Get the Current Booking
  async getBooking(bookingId: string) {
    const booking = await this.stripe.checkout.sessions.retrieve(bookingId);
    return booking;
  }

  // Ceate a Checkout Session
  async createCheckoutSession(data:any) {
    console.log(data);
    const session = await this.stripe.checkout.sessions.create({
      metadata:{
        bookingId: data.bookingId,
      },
      mode:"payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "wedding",
            },
            unit_amount: data.price*100,
          },
          quantity: 1,
        },
      ],
      success_url: `http://localhost:3000/success`,
      cancel_url: `http://localhost:3000/error`,
    });

    return session.url;
  }

  async SuccessSession(Session){
    console.log(Session)
  }

  async createPaymentIntent(items:CreatePaymentDto){
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

  private calculateOrderAmount(items:CreatePaymentDto):number{
    return 1400;
  }
  
 
}