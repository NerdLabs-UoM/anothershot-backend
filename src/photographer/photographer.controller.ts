import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  Put,
  Patch,
  Delete,
  HttpException, HttpStatus, Logger
} from '@nestjs/common';
import { CreateTestimonialDto } from './dto/testimonial.dto';
import { VisibilityDto } from './dto/visibility.dto';
import { PhotographerService } from './photographer.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Package, Photographer } from '@prisma/client';
import { contactDetailsDto } from './dto/contactDetails.dto';
import { FeedDto } from './dto/feed.dto';
import { FeedLikeDto } from './dto/feedLike.dto';
import { FeedSaveDto } from './dto/feedSave.dto';
import { DeleteFeedDto } from './dto/deleteFeed.dto';
import { CaptionDto } from './dto/caption.dto';
import { createPackageDto } from './dto/createPackage.dto';
import { updatePackageDto } from './dto/updatePackage.dto';
import { deletePackageDto } from './dto/deletePackage.dto';
import { AlbumsDto, updateAlbumDto, AlbumImagesDto } from './dto/album.dto';
import { bankDetailsDto } from './dto/bankDetails.dto';
import { ClientBookingDto } from './dto/clientBooking.dto';
import { createEventDto } from './dto/createEvent.dto';
import { updateEventDto } from './dto/updateEvent.dto';
import { deleteEventDto } from './dto/deleteEvent.dto';



@Controller('api/photographer')
export class PhotographerController {

  private readonly logger = new Logger(PhotographerController.name);

  constructor(private photographerService: PhotographerService) { }

  //------ photographer controllers -----------

  @Get(':id/get')
  async getPhotographer(@Param('id') userId: string) {
    return await this.photographerService.getPhotographer(userId);
  }

  @Get('get/all')
  async getAllPhotographers() {
    return await this.photographerService.findAll();
  }

  // ------hero section controllers ------

  @Put(':id/updateuser')
  async updateUser(
    @Param('id') id: string,
    @Body() data: Partial<Photographer>,
  ) {
    return await this.photographerService.updateUser(id, data);
  }

  @Post(':id/updateHeroSection')
  async updateHeroSection(
    @Param('id') id: string,
    @Body() data: Partial<Photographer>,
  ) {
    return await this.photographerService.updateHeroSection(id, data);
  }
  @Put(':id/cover-photo')
  async updateCoverPhoto(
    @Param('id') id: string,
    @Body() data: Partial<Photographer>,
  ) {
    return await this.photographerService.updateCoverPhoto(id, data);
  }

  @Put(':id/profile-picture')
  async updateProfilePicture(
    @Param('id') id: string,
    @Body() data: Partial<Photographer>,
  ) {
    return await this.photographerService.updateProfilePicture(id, data);
  }

  // ------- contact section controllers ---------

  @Put('contactdetails')
  async updateContactDetails(@Body() dto: contactDetailsDto) {
    return await this.photographerService.updateContactDetails(dto);
  }

  @Get('contactdetails/:id')
  async getContactDetails(@Param('id') id: string) {
    return await this.photographerService.getContactDetails(id);
  }

  // ------- package section controllers ---------

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

  // ------- featured section controllers ---------

  @Get('featured/:photographerId')
  async getFeatured(@Param('photographerId') id: string) {
    return await this.photographerService.getFeatured(id);
  }

  @Put(':id/featured')
  async updateFeatured(@Param('id') id: string, @Body() featured: Partial<Photographer>) {
    await this.photographerService.updateFeatured(id, featured);
  }

  // ------- testmonial controllers ---------

  @Post(':id/profile/testimonial')
    async createTestimonial(@Body() dto: CreateTestimonialDto) {
        this.logger.log(`Creating testimonial for photographer ID: ${dto.photographerId}`);
        try {
            const result = await this.photographerService.createTestimonial(dto);
            this.logger.log('Testimonial created successfully');
            return result;
        } catch (error) {
            this.logger.error(`Error creating testimonial: ${error.message}`, error.stack);
            throw new HttpException('Failed to create testimonial', HttpStatus.BAD_REQUEST);
        }
  }

  @Get(':id/profile/testimonials')
    async getTestimonials(@Param('id') photographerId: string) {
        this.logger.log(`Fetching testimonials for photographer ID: ${photographerId}`);
        try {
            const testimonials = await this.photographerService.getTestimonials(photographerId);
            this.logger.log('Testimonials fetched successfully');
            return testimonials;
        } catch (error) {
            this.logger.error(`Error fetching testimonials: ${error.message}`, error.stack);
            throw new HttpException('Failed to fetch testimonials', HttpStatus.BAD_REQUEST);
        }
  }

  @Patch(':id/profile/testimonials/visibility')
    async updateTestimonialVisibility(@Body() dto: VisibilityDto) {
        this.logger.log(`Updating testimonial visibility for testimonial ID: ${dto.testimonialId}`);
        try {
            await this.photographerService.updateTestimonialVisibility(dto);
            this.logger.log('Testimonial visibility updated successfully');
            return { message: 'Testimonials updated successfully' };
        } catch (error) {
            this.logger.error(`Error updating testimonial visibility: ${error.message}`, error.stack);
            throw new HttpException('Failed to update testimonials', HttpStatus.BAD_REQUEST);
        }
  }

  // ------- settings controllers ---------

  @Get('bankdetails/:id')
  async getBankDetails(@Param('id') id: string) {
    return await this.photographerService.getBankDetails(id);
  }

  @Put('bankdetails/:id')
  async updateBankDetails(
    @Param('id') id: string,
    @Body() dto: bankDetailsDto) {
    return await this.photographerService.updateBankDetails(id, dto);
  }

  @Get('getallcategories')
  async getAllCategories() {
    return await this.photographerService.getAllCategories();
  }

  @Get(':id/getcategory')
  async getCategoryById(@Param('id') id: string) {
    return await this.photographerService.getCategoryById(id);
  }

  @Put(':id/categories')
  async updateCategory(
    @Param('id') id: string,
    @Body() data: Partial<Photographer>,
  ) {
    return await this.photographerService.updateCategory(id, data);
  }

  // ------- album controllers ---------

  @Post(':id/createalbum')
  async createAlbum(@Body() dto: AlbumsDto) {
    return await this.photographerService.createAlbum(dto);
  }

  @Put(':id/editalbum')
  async editAlbum(@Body() dto: updateAlbumDto) {
    return await this.photographerService.editAlbum(dto);
  }

  @Get(':id/getalbum')
  async getAlbum(@Param('id') id: string) {
    return await this.photographerService.getAlbum(id);
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

  // ------- feed controllers ---------

  @Get(':id/feed')
  async getFeed(
      @Param('id') id: string
  ) {
      this.logger.log(`Getting feed for photographer with ID: ${id}`);
      try {
          return await this.photographerService.getFeed(id);
      } catch (error) {
          throw new HttpException(`Feed not found for photographer with ID: ${id}`, HttpStatus.NOT_FOUND);
      }
  }

  @Post(':id/feed/createFeed')
  async createFeedComponent(
      @Body() dto: FeedDto
  ) {
      this.logger.log(`Creating feed component for photographer with ID: ${dto.photographerId}`);
      try {
          return await this.photographerService.createFeedComponent(dto);
      } catch (error) {
          throw new HttpException(`Error creating feed component for photographer with ID: ${dto.photographerId}`, HttpStatus.BAD_REQUEST);
      }
  }

  @Patch(':id/feed/like')
  async feedLike(
      @Param('id') photographerId: string,
      @Body() dto: FeedLikeDto
  ) {
      this.logger.log(`Liking feed for photographer with ID: ${photographerId}`);
      try {
          return await this.photographerService.feedLike(photographerId, dto);
      } catch (error) {
          throw new HttpException(`Error liking feed for photographer with ID: ${photographerId}`, HttpStatus.BAD_REQUEST);
      }
  }

  @Patch(`:id/feed/createSave`)
  async feedSave(
      @Param('id') photographerId: string,
      @Body() dto: FeedSaveDto
  ) {
      this.logger.log(`Saving feed for photographer with ID: ${photographerId}`);
      try {
          return await this.photographerService.feedSave(photographerId, dto);
      } catch (error) {
          throw new HttpException(`Error saving feed for photographer with ID: ${photographerId}`, HttpStatus.BAD_REQUEST);
      }
  }

  @Delete(':id/feed/delete')
  async deleteFeed(
      @Body() dto: DeleteFeedDto
  ) {
      this.logger.log(`Deleting feed for image with ID: ${dto.feedId}`);
      try {
          return await this.photographerService.deleteFeed(dto);
      } catch (error) {
          throw new HttpException(`Error deleting feed for image with ID: ${dto.feedId}`, HttpStatus.BAD_REQUEST);
      }
  }

  @Get(':id/feed/header')
  async getFeedHeader(
      @Param('id') id: string
  ) {
      this.logger.log(`Getting feed header for photographer with ID: ${id}`);
      try {
          return await this.photographerService.getFeedHeader(id);
      } catch (error) {
          throw new HttpException(`Feed header not found for photographer with ID: ${id}`, HttpStatus.NOT_FOUND);
      }
  }

  @Patch(':id/feed/caption')
  async updateCaption(
      @Body() dto: CaptionDto
  ) {
      this.logger.log(`Updating caption for feed with ID: ${dto.feedId}`);
      try {
          return await this.photographerService.updateCaption(dto);
      } catch (error) {
          throw new HttpException(`Error updating caption for feed with ID: ${dto.feedId}`, HttpStatus.BAD_REQUEST);
      }
  }

  //------- booking controllers ---------



  @Get(':id/clientBookings')
  async getBookings(@Param('id') photographerId: string) {
    return await this.photographerService.getBookings(photographerId);
  }

  //------- event controllers ---------

  @Post(':id/event/create')
  async createEvents(@Body() dto: createEventDto) {
    return await this.photographerService.createEvents(dto);
  }

  @Get(':id/event/get')
  async getEvents(@Param('id') eventId: string) {
    return await this.photographerService.getEvents(eventId);
  }

  @Get(':id/event/getEventById')
  async getEventById(@Param('eventId') eventId: string){
    return await this.photographerService.getEventById(eventId);
  }

  @Put(':id/event/update')
  async updateEvents(@Body() dto: updateEventDto) {
    return await this.photographerService.updateEvents(dto);
  }

  @Delete(':id/event/delete')
  async deleteEvents(@Body() dto: deleteEventDto) {
    return await this.photographerService.deleteEvents(dto);
  }
  // ------- booking creation controllers ---------
  
  @Get(':id/bookingsCategory')
  async getBookingsCategory(@Param('id') id: string) {
    this.logger.log(`Fetching bookings categories for photographer: ${id}`);
    try {
      return await this.photographerService.getBookingsCategory(id);
    } catch (error) {
      this.logger.error(`Failed to fetch bookings categories for photographer: ${id}`, error.stack);
      throw new HttpException('Failed to fetch bookings categories', HttpStatus.NOT_FOUND);  
    }
  }

  @Get(':id/bookingsPackage')
  async getBookingsPackage(@Param('id') id: string) {
    this.logger.log(`Fetching bookings package for photographer: ${id}`);
    try {
      return await this.photographerService.getBookingsPackage(id);
    } catch (error) {
      this.logger.error(`Failed to fetch bookings package for photographer with ID: ${id}`, error.stack);
      throw new HttpException('Failed to fetch bookings package', HttpStatus.NOT_FOUND);
    }
  }
  
  @Post(':id/clientBooking')
  async clientBooking(@Body() dto: ClientBookingDto){
    this.logger.log(`Creating booking for client with ID: ${dto.clientId}`);
    try {
      return await this.photographerService.clientBooking(dto);
    } catch (error) {
      this.logger.error(`Failed to create booking for client with ID: ${dto.clientId}`, error.stack);
      throw new HttpException('Failed to create booking', HttpStatus.NOT_FOUND);
    }
  }

  // ------- getting like and save images controllers ---------

  @Get(':id/likeImages')
  async getLikedImages(@Param('id') id: string) {
    this.logger.log(`Fetching liked images for user with ID: ${id}`);
    try {
      return await this.photographerService.getLikedImages(id);
    } catch (error) {
      this.logger.error(`Failed to fetch liked images for user with ID: ${id}`, error.stack);
      throw new HttpException('Failed to fetch liked images', HttpStatus.NOT_FOUND);
    }
  }

  @Get(':id/savedImages')
  async getSavedImages(@Param('id') id: string) {
    this.logger.log(`Fetching saved images for user with ID: ${id}`);
    try {
      return await this.photographerService.getSavedImages(id);
    } catch (error) {
      this.logger.error(`Failed to fetch saved images for user with ID: ${id}`, error.stack);
      throw new HttpException('Failed to fetch saved images', HttpStatus.NOT_FOUND);
    }
  }

  // ------- getting earnings and payments controllers ---------
  @Get(':id/getPayments')
  async getPayments(@Param('id') id: string){
    return await this.photographerService.getPayments(id);
  }

  @Get(':id/earnings')
  async getEarnings(@Param('id') id: string){
    return await this.photographerService.getEarnings(id);
  }


}
