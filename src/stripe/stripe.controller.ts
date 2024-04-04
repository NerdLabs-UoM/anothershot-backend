import { Body, Controller ,Post} from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('api/stripe')
export class StripeController 
{
    constructor(private readonly stripeService: StripeService) {}
  
    @Post('create-payment-link')
    async createPaymentLink(@Body() data: { priceId: string }): Promise<any> {
      const { priceId } = data;
  
      try {
        const stripe = this.stripeService.getStripeClient();
        const paymentLink = await stripe.paymentLinks.create({
          line_items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
        });
  
        return { paymentLink };
      } catch (error) {
        return { error: error.message };
      }
    }


    @Post('checkout-session')
    async createCheckout(@Body() data): Promise<any> {
      return await this.stripeService.checkoutSession(data)
    }
  }
