import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Put } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentStatus } from '@prisma/client';

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

  @Get('get-all-payments')
  async findAll() {
    return this.paymentService.getAllPayments();
  }

  @Get(':id/get-payment')
  async getPayment(@Param('id') id: string) {
    return this.paymentService.getPaymentById(id);
  }

  @Put('update-payment-status/:id')
  async updatePaymentStatus(@Param('id') id: string, @Body() data: any) {
      return this.paymentService.updatePaymentStatus(id, data);
  }
}
