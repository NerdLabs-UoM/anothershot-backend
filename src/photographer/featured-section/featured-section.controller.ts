import { Controller, Get, Post, Body, Put , Patch, Param, Delete } from '@nestjs/common';
import { FeaturedSectionService } from './featured-section.service';
import { Injectable, NotFoundException, Logger, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { Photographer } from '@prisma/client';


@Controller('api/photographer')
export class FeaturedSectionController {
  private readonly logger = new Logger(FeaturedSectionService.name);

  constructor(private readonly featuredSectionService: FeaturedSectionService) {}

  @Get('featured/:photographerId')
  async getFeatured(@Param('photographerId') id: string) {
    try {
      this.logger.log(`Fetching featured photographer for photographer ID: ${id}`);
      const featuredPhotographer = await this.featuredSectionService.getFeatured(id);
      if (!featuredPhotographer) {
        this.logger.warn(`No featured photographer found for photographer ID: ${id}`);
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Featured photographer not found for the given ID.',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      this.logger.log(`Featured photographer fetched successfully for photographer ID: ${id}`);
      return featuredPhotographer;
    } catch (error) {
      this.logger.error(`Error fetching featured photographer for photographer ID: ${id}`, error.message);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was a problem fetching the featured photographer.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id/featured')
  async updateFeatured(@Param('id') id: string, @Body() featured: Partial<Photographer>) {
    try {
      this.logger.log(`Updating featured photographer for ID: ${id}`);
      await this.featuredSectionService.updateFeatured(id, featured);
      this.logger.log(`Featured photographer updated successfully for ID: ${id}`);
    } catch (error) {
      this.logger.error(`Error updating featured photographer for ID: ${id}`, error.message);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was a problem updating the featured photographer.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
