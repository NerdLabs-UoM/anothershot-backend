import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Put,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { bankDetailsDto } from '../dto/bankDetails.dto';
import { Photographer } from '@prisma/client';
import { PhotographerController } from '../photographer.controller';

@Controller('api/photographer')
export class SettingsController {
  private readonly logger = new Logger(SettingsController.name);

  constructor(private settingsService: SettingsService) {}

  @Get('bankdetails/:id')
  async getBankDetails(@Param('id') id: string) {
    this.logger.log(`Received request to fetch bank details for ID: ${id}`);
    try {
      const bankDetails = await this.settingsService.getBankDetails(id);
        this.logger.log(`Successfully fetched bank details for ID: ${id}`);
      return bankDetails;
    } catch (error) {
        this.logger.error(`Failed to fetch bank details for ID: ${id}`, error.stack);
      throw new HttpException(
        'Error fetching bank details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

    @Put('bankdetails/:id')
    async updateBankDetails(
      @Param('id') id: string,
      @Body() dto: bankDetailsDto) {
        this.logger.log(`Received request to update bank details for photographer with ID: ${id} and data: ${JSON.stringify(dto)}`);
        try {
          const updatedDetails = await this.settingsService.updateBankDetails(id, dto);
          this.logger.log(`Successfully updated bank details for photographer with ID: ${id}`);
          return updatedDetails;
        } catch (error) {
          this.logger.error(`Failed to update bank details for photographer with ID: ${id}`, error.stack);
          throw new HttpException('Error updating bank details', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('getallcategories')
    async getAllCategories() {
      this.logger.log('Received request to fetch all categories');
      try {
        const categories = await this.settingsService.getAllCategories();
        this.logger.log('Successfully fetched all categories');
        return categories;
      } catch (error) {
        this.logger.error('Failed to fetch all categories', error.stack);
        throw new HttpException('Error fetching categories', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    @Get(':id/getcategory')
    async getCategoryById(@Param('id') id: string) {
      this.logger.log(`Received request to fetch category details for ID: ${id}`);
      try {
        const category = await this.settingsService.getCategoryById(id);
        this.logger.log(`Successfully fetched category details for ID: ${id}`);
        return category;
      } catch (error) {
        this.logger.error(`Failed to fetch category details for ID: ${id}`, error.stack);
        throw new HttpException('Error fetching category details', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    @Put(':id/categories')
    async updateCategory(
      @Param('id') id: string,
      @Body() data: Partial<Photographer>,
    ) {
      this.logger.log(`Received request to update category for photographer with ID: ${id} and data: ${JSON.stringify(data)}`);
      try {
        const updatedCategory = await this.settingsService.updateCategory(id, data);
        this.logger.log(`Successfully updated category for photographer with ID: ${id}`);
        return updatedCategory;
      } catch (error) {
        this.logger.error(`Failed to update category for photographer with ID: ${id}`, error.stack);
        throw new HttpException('Error updating category', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    @Get(':id/getPayments')
  async getPayments(@Param('id') id: string){
    this.logger.log(`Received request to fetch payments for photographer with ID: ${id}`);
    try {
      const payments = await this.settingsService.getPayments(id);
      this.logger.log(`Successfully fetched payments for photographer with ID: ${id}`);
      return payments;
    } catch (error) {
      this.logger.error(`Failed to fetch payments for photographer with ID: ${id}`, error.stack);
      throw new HttpException('Error fetching payments', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id/earnings')
  async getEarnings(@Param('id') id: string){
    this.logger.log(`Received request to fetch earnings for photographer with ID: ${id}`);
    try {
      const earnings = await this.settingsService.getEarnings(id);
      this.logger.log(`Successfully fetched earnings for photographer with ID: ${id}`);
      return earnings;
    } catch (error) {
      this.logger.error(`Failed to fetch earnings for photographer with ID: ${id}`, error.stack);
      throw new HttpException('Error fetching earnings', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
