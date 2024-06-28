import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Param,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientImageDto, ClientDto } from './dto/client.dto';
import { DeleteBookingDto } from './dto/deleteBooking.dto';

@Controller('api/client')
export class ClientController {
  private readonly logger = new Logger(ClientController.name);

  constructor(private clientService: ClientService) {}

  // Update client's profile image

  @Patch(':id/profile/image')
  async updateImage(@Body() dto: ClientImageDto) {
    this.logger.log(`Updating image for client with ID: ${dto.clientId}`);
    try {
      const result = await this.clientService.updateImage(dto);
      this.logger.log(
        `Image updated successfully for client with ID: ${dto.clientId}`
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to update image for client with ID: ${dto.clientId}`,
        error.stack
      );
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Update client's profile

  @Patch(':id/profile')
  async updateProfile(@Body() dto: ClientDto) {
    this.logger.log(`Updating profile for client with ID: ${dto.clientId}`);
    try {
      const result = await this.clientService.updateProfile(dto);
      this.logger.log(
        `Profile updated successfully for client with ID: ${dto.clientId}`
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to update profile for client with ID: ${dto.clientId}`,
        error.stack
      );
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Get client details by ID

  @Get(':id/clientDetails')
  async getClientDetails(@Param('id') id: string) {
    this.logger.log(`Fetching details for client with ID: ${id}`);
    try {
      const result = await this.clientService.getClientDetails(id);
      this.logger.log(`Fetched details successfully for client with ID: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to fetch details for client with ID: ${id}`,
        error.stack
      );
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  // Get liked images by client ID

  @Get(':id/likeImages')
  async getLikedImages(@Param('id') id: string) {
    this.logger.log(`Fetching liked images for client with ID: ${id}`);
    try {
      const result = await this.clientService.getLikedImages(id);
      this.logger.log(
        `Fetched liked images successfully for client with ID: ${id}`
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to fetch liked images for client with ID: ${id}`,
        error.stack
      );
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  // Get saved images by client ID

  @Get(':id/savedImages')
  async getSavedImages(@Param('id') id: string) {
    this.logger.log(`Fetching saved images for client with ID: ${id}`);
    try {
      const result = await this.clientService.getSavedImages(id);
      this.logger.log(
        `Fetched saved images successfully for client with ID: ${id}`
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to fetch saved images for client with ID: ${id}`,
        error.stack
      );
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  // Get bookings by client ID

  @Get(':id/clientBookings')
  async getBookings(@Param('id') clientId: string) {
    this.logger.log(`Fetching bookings for client with ID: ${clientId}`);
    try {
      const result = await this.clientService.getBookings(clientId);
      this.logger.log(
        `Fetched bookings successfully for client with ID: ${clientId}`
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to fetch bookings for client with ID: ${clientId}`,
        error.stack
      );
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  // Delete a booking by client ID and booking ID

  @Delete(':id/deleteBooking')
  async deleteBooking(@Body() dto: DeleteBookingDto) {
    this.logger.log(
      `Deleting booking for client with booking ID: ${dto.bookingId}`
    );
    try {
      const result = await this.clientService.deleteBooking(dto);
      this.logger.log(
        `Booking deleted successfully for client with booking ID: ${dto.bookingId}`
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to delete booking for client with booking ID: ${dto.bookingId}`,
        error.stack
      );
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
