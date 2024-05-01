import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('api/payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.createPaymentIntent(createPaymentDto);
  }

  @Post('create-checkout-session')
  async createCheckoutSession(@Body() createPaymentDto: any) {
    return this.paymentService.createCheckoutSession(createPaymentDto);
  }

  @Get('success/checkout-session')
  paymentSuccess(@Res ({passthrough:true}) res){
    return this.paymentService.SuccessSession(res)
  }
}
