import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    HttpException, HttpStatus, Logger
  } from '@nestjs/common';
  import { ClientBookingDto } from '../dto/clientBooking.dto';
  import { BookingCreateService } from './booking-create.service';
  
  
  @Controller('api/photographer')
  export class BookingCreateController {
  
    private readonly logger = new Logger(BookingCreateController.name);
  
    constructor(private bookingCreateService: BookingCreateService) { }

     // ------- booking creation controllers ---------
    
     @Get(':id/bookingsCategory')
     async getBookingsCategory(@Param('id') id: string) {
       this.logger.log(`Fetching bookings categories for photographer: ${id}`);
       try {
         return await this.bookingCreateService.getBookingsCategory(id);
       } catch (error) {
         this.logger.error(`Failed to fetch bookings categories for photographer: ${id}`, error.stack);
         throw new HttpException('Failed to fetch bookings categories', HttpStatus.NOT_FOUND);  
       }
     }
   
     @Get(':id/bookingsPackage')
     async getBookingsPackage(@Param('id') id: string) {
       this.logger.log(`Fetching bookings package for photographer: ${id}`);
       try {
         return await this.bookingCreateService.getBookingsPackage(id);
       } catch (error) {
         this.logger.error(`Failed to fetch bookings package for photographer with ID: ${id}`, error.stack);
         throw new HttpException('Failed to fetch bookings package', HttpStatus.NOT_FOUND);
       }
     }
     
     @Post(':id/clientBooking')
     async clientBooking(@Body() dto: ClientBookingDto){
       this.logger.log(`Creating booking for client with ID: ${dto.clientId}`);
       try {
         return await this.bookingCreateService.clientBooking(dto);
       } catch (error) {
         this.logger.error(`Failed to create booking for client with ID: ${dto.clientId}`, error.stack);
         throw new HttpException('Failed to create booking', HttpStatus.NOT_FOUND);
       }
     }
   
  }
  
