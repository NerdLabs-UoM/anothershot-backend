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

  //Create an Endpoint for Creating Payment Links
  async purchaseBooking(bookingId: string){
    const paymentLink = await this.stripe.paymentLinks.create({
      line_items:[
        {
          price: '{{PRICE_ID}}',
          quantity: 1,
        },
      ],
      after_completion:{
        type:'redirect',
        redirect:{
          url:'https://example.com',
        }
      }     
    })
  }

  //Ceate a Checkout Session
  // async createCheckoutSession(bookingId: string) {
  //   const session = await this.stripe.checkout.sessions.create({
  //     payment_method_types: ['card'],
  //     line_items: [
  //       {
  //         price_data: {
  //           currency: 'usd',
  //           product_data: {
  //             name: "t-shirt",
  //           },
  //           unit_amount: 2000,
  //         },
  //         quantity: 1,
  //       },
  //     ],
  //     mode: 'payment',
  //     success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
  //     cancel_url: `http://localhost:3000/cancel`,
  //   });
  //   return session;
  // }

  // //Create session as responce to frontend
  // async createCheckoutSessionResponse(bookingId: string) {
  //   const session = await this.createCheckoutSession(bookingId);
  //   return {
  //     sessionId: session.id,
  //   };
  // }


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
  
  create(createPaymentDto: CreatePaymentDto) {
    return 'This action adds a new payment';
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}