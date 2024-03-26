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
  Delete,
} from '@nestjs/common';
import { CreateTestimonialDto } from './dto/testimonial.dto';
import { VisibilityDto } from './dto/visibility.dto';
import { PhotographerService } from './photographer.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { UpdatePhotographerDto } from './dto/photographer.dto';
import {
  Photographer,
  User,
  PhotographerCategory,
  Report,
} from '@prisma/client';
import { contactDetailsDto } from './dto/contactDetails.dto';
import { bankDetailsDto } from './dto/bankDetails.dto';
import { ReportDto } from './dto/report.dto';
import { AlbumImagesDto, AlbumsDto, updateAlbumDto } from './dto/album.dto';
@Controller('api/photographer')
export class PhotographerController {
  constructor(private photographerService: PhotographerService) {}

  @Post(':id/profile/testimonial')
  async createTestimonial(@Body() dto: CreateTestimonialDto) {
    return await this.photographerService.createTestimonial(dto);
  }

  @Get(':id/profile/testimonials')
  async getTestimonials(@Param('id') photographerId: string) {
    return await this.photographerService.getTestimonials(photographerId);
  }

  @Patch(':id/profile/testimonials/visibility')
  async updateTestimonialVisibility(@Body() dto: VisibilityDto) {
    try {
      await this.photographerService.updateTestimonialVisibility(dto);
      return { message: 'Testimonials updated successfully' };
    } catch (error) {
      throw new HttpException(
        'Failed to update testimonials',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('get/all')
  async getAllPhotographers() {
    return await this.photographerService.findAll();
  }

  @Get('getallcategories')
  async getAllCategories() {
    return PhotographerCategory;
  }

  @Put(':id/categories')
  async updateCategory(
    @Param('id') id: string,
    @Body() data: Partial<Photographer>,
  ) {
    return await this.photographerService.updateCategory(id, data);
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
  async updateContactDetails(@Body() dto: contactDetailsDto) {
    return await this.photographerService.updateContactDetails(dto);
  }

  @Get('contactdetails/:id')
  async getContactDetails(@Param('id') id: string) {
    return await this.photographerService.getContactDetails(id);
  }

  @Post('report/:id')
  async createReport(@Param('id') id: string, @Body() dto: ReportDto) {
    return await this.photographerService.createReport(id, dto);
  }

  @Get('bankdetails/:id')
  async getBankDetails(@Param('id') id: string) {
    return await this.photographerService.getBankDetails(id);
  }

  @Put('bankdetails')
  async updateBankDetails(@Body() dto: bankDetailsDto) {
    return await this.photographerService.updateBankDetails(dto);
  }

  @Post(':id/createalbum')
  async createAlbum(@Body() dto: AlbumsDto) {
    return await this.photographerService.createAlbum(dto);
  }

  @Put(':id/editalbum')
  async editAlbum(@Body() dto:updateAlbumDto) {
    return await this.photographerService.editAlbum(dto);
  }

  @Get(':id/getalbums')
  async getAlbums(@Param('id') id: string) {
    return await this.photographerService.getAlbums(id);
  }

  @Get(':id/getimages')
  async getImages(@Param('id') id: string) {
    return await this.photographerService.getImages(id);
  }

  @Delete(':id/deletealbum')
  async deleteAlbum(@Param('id') id: string) {
    return await this.photographerService.deleteAlbum(id);
  }

  @Post(':id/addimages')
  async addImages(@Body() dto: AlbumImagesDto) {
    return await this.photographerService.addImages(dto);
  }

  @Delete(':id/deleteimage')
  async deleteImage(@Param('id') id: string) {
    return await this.photographerService.deleteImage(id);
  }
}
