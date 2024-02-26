import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  Request,
  Patch,
} from '@nestjs/common';
import { CreateTestimonialDto } from './dto/testimonial.dto';
import { VisibilityDto } from './dto/visibility.dto';
import { PhotographerService } from './photographer.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';


@Controller('api/user/photographer')
export class PhotographerController {
  constructor(private photographerService: PhotographerService) {}

  //@UseGuards(JwtGuard)
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
    return await this.photographerService.updateTestimonialVisibility(dto);
  }

}
