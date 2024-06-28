import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  Put,
  Query,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment.dto';

@Controller('api/payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(private readonly paymentService: PaymentService) {}

  // Create a new payment intent
  @Post('create-payment-intent')
  async createPaymentIntent(@Body() createPaymentDto: CreatePaymentDto) {
    try {
      this.logger.log('Creating payment intent');
      return this.paymentService.createPaymentIntent(createPaymentDto);
    } catch (error) {
      this.logger.error('Failed to create payment intent', error.stack);
      throw new InternalServerErrorException('Could not create payment intent');
    }
  }

  // Create a new checkout session
  @Post('create-checkout-session')
  async createCheckoutSession(@Body() createPaymentDto: any) {
    try {
      this.logger.log('Creating checkout session');
      return this.paymentService.createCheckoutSession(createPaymentDto);
    } catch (error) {
      this.logger.error('Failed to create checkout session', error.stack);
      throw new InternalServerErrorException(
        'Could not create checkout session'
      );
    }
  }

  // Create a new checkout session for an album
  @Post('create-checkout-session-album')
  async createCheckoutSessionAlbum(@Body() createPaymentDto: any) {
    try {
      this.logger.log('Creating checkout session for album');
      return this.paymentService.createCheckoutSessionAlbum(createPaymentDto);
    } catch (error) {
      this.logger.error(
        'Failed to create checkout session for album',
        error.stack
      );
      throw new InternalServerErrorException(
        'Could not create checkout session for album'
      );
    }
  }

  // Handle payment success
  @Get('success/checkout-session')
  paymentSuccess(@Res({ passthrough: true }) res) {
    try {
      this.logger.log('Handling payment success');
      return this.paymentService.SuccessSession(res);
    } catch (error) {
      this.logger.error('Failed to handle payment success', error.stack);
      throw new InternalServerErrorException(
        'Could not handle payment success'
      );
    }
  }

  // Get all payments
  @Get('get-all-payments')
  async findAll() {
    try {
      this.logger.log('Fetching all payments');
      return this.paymentService.getAllPayments();
    } catch (error) {
      this.logger.error('Failed to fetch all payments', error.stack);
      throw new InternalServerErrorException('Could not fetch all payments');
    }
  }

  // Get payment by ID
  @Get(':id/get-payment')
  async getPayment(@Param('id') id: string) {
    try {
      this.logger.log(`Fetching payment with ID: ${id}`);
      return this.paymentService.getPaymentById(id);
    } catch (error) {
      this.logger.error(`Failed to fetch payment with ID: ${id}`, error.stack);
      throw new InternalServerErrorException('Could not fetch payment');
    }
  }

  // Update payment status by ID
  @Put('update-payment-status/:id')
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body() data: UpdatePaymentStatusDto
  ) {
    try {
      this.logger.log(`Updating payment status for ID: ${id}`);
      return this.paymentService.updatePaymentStatus(id, data);
    } catch (error) {
      this.logger.error(
        `Failed to update payment status for ID: ${id}`,
        error.stack
      );
      throw new InternalServerErrorException('Could not update payment status');
    }
  }

  // Get all users with pagination and optional name filter
  @Get('getallusers')
  async getAllUsers(@Query('page') page: number, @Query('name') name: string) {
    try {
      this.logger.log('Fetching all users with pagination');
      return await this.paymentService.findall(page, name);
    } catch (error) {
      this.logger.error('Failed to fetch all users', error.stack);
      throw new InternalServerErrorException('Could not find users');
    }
  }

  // Get last page of users with optional name and roles filter
  @Get('getlastpage')
  async getLastPage(
    @Query('name') name: string,
    @Query('roles') roles: string
  ) {
    try {
      this.logger.log('Fetching last page of users');
      return await this.paymentService.findLastPage(name, roles);
    } catch (error) {
      this.logger.error('Failed to fetch last page of users', error.stack);
      throw new InternalServerErrorException('Could not find users');
    }
  }
}
