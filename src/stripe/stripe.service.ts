import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { Package } from '@prisma/client';

@Injectable()
export class StripeService {
  private readonly stripeClient: Stripe;
  stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  getStripeClient(): Stripe {
    return this.stripeClient;
  }

  async checkoutSession(data: any): Promise<any> {
    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: data.currency,
            product_data: {
              name: data.name,
            },
            unit_amount: data.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://stripe.com/',
      cancel_url: 'https://stripe.com/',
    });

    return session.url;
  }
}
