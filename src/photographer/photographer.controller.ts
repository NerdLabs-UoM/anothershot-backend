import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  Put,
  Request,
  Patch,
} from '@nestjs/common';
import { CreateTestimonialDto } from './dto/testimonial.dto';
import { VisibilityDto } from './dto/visibility.dto';
import { PhotographerService } from './photographer.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { UpdatePhotographerDto } from './dto/photographer.dto';
import { Photographer, User } from '@prisma/client';
import { contactDetailsDto } from './dto/contactDetails.dto';

@Controller('api/photographer')
export class PhotographerController {
    constructor(private photographerService: PhotographerService) { }
  
   @Post(':id/profile/testimonial')
  async createTestimonial(@Body() dto: CreateTestimonialDto) {
    return await this.photographerService.createTestimonial(dto);
  }

  @Get(':id/profile/testimonials')
  async getTestimonials(@Param('id') photographerId: string) {
    return await this.photographerService.getTestimonials(photographerId);
  }

  //@UseGuards(JwtGuard)
  @Patch(':id/profile/testimonials/visibility')
  async updateTestimonialVisibility(
    @Body() dto: VisibilityDto,
  ) {
    try {
      await this.photographerService.updateTestimonialVisibility(
        dto
      );
      return { message: 'Testimonials updated successfully' };
    } catch (error) {
      throw new HttpException('Failed to update testimonials', HttpStatus.BAD_REQUEST);
    }
  }  

    @Get('get/all')
    async getAllPhotographers() {
        return await this.photographerService.findAll();
    }

    @Get(':id')
    async getUser(@Param('id') id: string) {
        return await this.photographerService.findById(id);
    }

    @Put(':id/profile-picture')
    async updateProfilePicture(
        @Param('id') id: string,
        @Body() data: Partial<Photographer>,
    ) {
        return await this.photographerService.updateProfilePicture(id, data);
    }

    @Put(':id/cover-photo')
    async updateCoverPhoto(
        @Param('id') id: string,
        @Body() data: Partial<Photographer>,
    ) {
        return await this.photographerService.updateCoverPhoto(id, data);
    }

    @Put('contactdetails')
    async updateContactDetails(
        @Body() dto: contactDetailsDto,
    ) {
        return await this.photographerService.updateContactDetails(dto);
    }

    @Get('contactdetails/:id')
    async getContactDetails(@Param('id') id: string) {
        return await this.photographerService.getContactDetails(id);
    }
}
