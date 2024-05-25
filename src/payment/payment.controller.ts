import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  Put,
  Query,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment.dto';


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
  paymentSuccess(@Res({ passthrough: true }) res) {
    return this.paymentService.SuccessSession(res);
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
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body() data: UpdatePaymentStatusDto,
  ) {
    console.log(data);
    return this.paymentService.updatePaymentStatus(id, data);
  }

  @Get('getallusers')
  async getAllUsers(@Query('page') page: number, @Query('name') name: string ) {
    try {
      return await this.paymentService.findall(page, name);
    } catch (err) {
      throw Error("Could not find payments")
    }
  }

  @Get('getlastpage')
    async getLastPage(@Query('name') name: string,@Query('roles') roles: string){
        try {
            return await this.paymentService.findLastPage(name,roles);
        } catch (err) {
            throw Error("Could not find payments")
        }
    }
}
