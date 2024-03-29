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
import { Package, Photographer, User } from '@prisma/client';
import { contactDetailsDto } from './dto/contactDetails.dto';
import { FeedDto } from './dto/feed.dto';
import { FeedLikeDto } from './dto/feedLike.dto';
import { FeedSaveDto} from './dto/feedSave.dto';
import { DeleteFeedDto } from './dto/deleteFeed.dto';
import { CaptionDto } from './dto/caption.dto';
import { createPackageDto } from './dto/createPackage.dto';
import { updatePackageDto } from './dto/updatePackage.dto';
import { deletePackageDto } from './dto/deletePackage.dto';

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

    @Put(':id/cover-photo')
    async updateCoverPhoto(
        @Param('id') id: string,
        @Body() data: Partial<Photographer>,
    ) {
        return await this.photographerService.updateCoverPhoto(id, data);
    }
  
    @Put(':id')
    async updateUser(
        @Param('id') id: string,
        @Body() data: Partial<Photographer>,
    ) {
        return await this.photographerService.updateUser(id, data);
    }

  @Put(':id/profile-picture')
  async updateProfilePicture(
    @Param('id') id: string,
    @Body() data: Partial<Photographer>,
  ) {
    return await this.photographerService.updateProfilePicture(id, data);
  }

  @Put('contactdetails')
  async updateContactDetails(@Body() dto: contactDetailsDto) {
    return await this.photographerService.updateContactDetails(dto);
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

    @Get('contactdetails/:id')
    async getContactDetails(@Param('id') id: string) {
        return await this.photographerService.getContactDetails(id);
    }
  
    @Get(':id/feed')
    async getFeed(@Param('id') id: string, clientid: string) {
        return await this.photographerService.getFeed(id);
    }
    @Post(':id/feed/createFeed')
      async createFeedComponent(@Body() dto: FeedDto) {
        return await this.photographerService.createFeedComponent(dto);
      }
    @Patch(':id/feed/like')
    async feedLike(@Body() dto: FeedLikeDto) {
      return await this.photographerService.feedLike(dto);
    }
    @Patch(`:id/feed/createSave`)
    async feedSave(@Body() dto: FeedSaveDto){
      return await this.photographerService.feedSave(dto);
    }
    @Delete(':id/feed/delete')
    async deleteFeed(@Body() dto: DeleteFeedDto) {
      return await this.photographerService.deleteFeed(dto);
    }
    @Get(':id/feed/header')
    async getFeedHeader(@Param('id') id: string) {
      return await this.photographerService.getFeedHeader(id);
    }
    @Patch(':id/feed/caption')
    async updateCaption(@Body() dto: CaptionDto) {
      return await this.photographerService.updateCaption(dto);
    }

    @Post('packages/create')
    async createPackage(
        @Body() dto: createPackageDto,
    ) {
        return await this.photographerService.createPackage(dto);
    }

    @Put('packages/edit')
    async updatePackageDetails(
        @Body() dto: updatePackageDto,
    ) {
        return await this.photographerService.updatePackageDetails(dto);
    }

    @Get('packages/:photographerId')
    async getPackageDetails(@Param('photographerId') photographerId: string) {
        return await this.photographerService.getPackageDetails(photographerId);
    }

    @Get(':packageId/package')
    async getPackageById(@Param('packageId') packageId: string) {
        return await this.photographerService.getPackageById(packageId);
    }

    @Delete('packages/delete')
    async deletePackage(@Body() dto: deletePackageDto) {
        return await this.photographerService.deletePackageDetails(dto);
    }

    @Put(':packageId/coverphotos')
    async saveCoverPhotos(@Param('packageId') packageId: string, @Body() coverPhotos: Partial<Package>) {
        await this.photographerService.saveCoverPhotos(packageId, coverPhotos);
    }
}
