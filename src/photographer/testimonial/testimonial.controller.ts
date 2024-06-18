import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { CreateTestimonialDto } from '../dto/testimonial.dto';
import { VisibilityDto } from '../dto/visibility.dto';
import { TestimonialService } from './testimonial.service';

@Controller('api/photographer')
export class TestimonialController {
  private readonly logger = new Logger(TestimonialController.name);

  constructor(private testimonialService: TestimonialService) {}

  // ------- testmonial controllers ---------

  @Post(':id/profile/testimonial')
  async createTestimonial(@Body() dto: CreateTestimonialDto) {
    this.logger.log(
      `Creating testimonial for photographer ID: ${dto.photographerId}`,
    );
    try {
      const result = await this.testimonialService.createTestimonial(dto);
      this.logger.log('Testimonial created successfully');
      return result;
    } catch (error) {
      this.logger.error(
        `Error creating testimonial: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        'Failed to create testimonial',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id/profile/testimonials')
  async getTestimonials(@Param('id') photographerId: string) {
    this.logger.log(
      `Fetching testimonials for photographer ID: ${photographerId}`,
    );
    try {
      const testimonials =
        await this.testimonialService.getTestimonials(photographerId);
      this.logger.log('Testimonials fetched successfully');
      return testimonials;
    } catch (error) {
      this.logger.error(
        `Error fetching testimonials: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        'Failed to fetch testimonials',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch(':id/profile/testimonials/visibility')
  async updateTestimonialVisibility(@Body() dto: VisibilityDto) {
    this.logger.log(
      `Updating testimonial visibility for testimonial ID: ${dto.testimonialId}`,
    );
    try {
      await this.testimonialService.updateTestimonialVisibility(dto);
      this.logger.log('Testimonial visibility updated successfully');
      return { message: 'Testimonials updated successfully' };
    } catch (error) {
      this.logger.error(
        `Error updating testimonial visibility: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        'Failed to update testimonials',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  @Get(':id/profile/testimonials/public')
  async getPublicTestimonials(@Param('id') photographerId: string) {
    this.logger.log(
      `Fetching public testimonials for photographer ID: ${photographerId}`,
    );
    try {
      const testimonials =
        await this.testimonialService.getPublicTestimonials(photographerId);
      this.logger.log('Public testimonials fetched successfully');
      return testimonials;
    } catch (error) {
      this.logger.error(
        `Error fetching public testimonials: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        'Failed to fetch public testimonials',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
