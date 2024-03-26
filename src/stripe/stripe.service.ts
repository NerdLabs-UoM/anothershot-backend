import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { Package } from '@prisma/client';

@Injectable()
export class StripeService {
    private stripe;
    
    constructor(){
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!,{
            apiVersion: '2023-10-16'
        })
    }
}

