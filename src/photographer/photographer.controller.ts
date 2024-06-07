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
  Logger,
  HttpStatus 
} from '@nestjs/common';
import { CreateTestimonialDto } from './dto/testimonial.dto';
import { VisibilityDto } from './dto/visibility.dto';
import { PhotographerService } from './photographer.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { HttpException } from '@nestjs/common';
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
    try {
      this.logger.log(`Updating contact details for user ID: ${dto.userId}`);
      const updatedDetails = await this.photographerService.updateContactDetails(dto);
      this.logger.log(`Contact details updated successfully for user ID: ${dto.userId}`);
      return updatedDetails;
    } catch (error) {
      this.logger.error(`Error updating contact details for user ID: ${dto.userId}`, error.message);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was a problem updating the contact details.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('contactdetails/:id')
  async getContactDetails(@Param('id') id: string) {
    try {
      this.logger.log(`Fetching contact details for user ID: ${id}`);
      const contactDetails = await this.photographerService.getContactDetails(id);
      if (!contactDetails) {
        this.logger.warn(`No contact details found for user ID: ${id}`);
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Contact details not found.',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      this.logger.log(`Contact details fetched successfully for user ID: ${id}`);
      return contactDetails;
    } catch (error) {
      this.logger.error(`Error fetching contact details for user ID: ${id}`, error.message);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was a problem fetching the contact details.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ------- package section controllers ---------

  @Post('packages/create')
  async createPackage(@Body() dto: createPackageDto) {
    try {
      this.logger.log(`Creating package for photographer ID: ${dto.photographerId}`);
      const createdPackage = await this.photographerService.createPackage(dto);
      this.logger.log(`Package created successfully for photographer ID: ${dto.photographerId}`);
      return createdPackage;
    } catch (error) {
      this.logger.error(`Error creating package for photographer ID: ${dto.photographerId}`, error.message);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was a problem creating the package.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('packages/edit')
  async updatePackageDetails(@Body() dto: updatePackageDto) {
    try {
      this.logger.log(`Updating package details for package ID: ${dto.packageId}`);
      const updatedPackage = await this.photographerService.updatePackageDetails(dto);
      this.logger.log(`Package details updated successfully for package ID: ${dto.packageId}`);
      return updatedPackage;
    } catch (error) {
      this.logger.error(`Error updating package details for package ID: ${dto.packageId}`, error.message);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was a problem updating the package details.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('packages/:photographerId')
  async getPackageDetails(@Param('photographerId') photographerId: string) {
    try {
      this.logger.log(`Fetching package details for photographer ID: ${photographerId}`);
      const packages = await this.photographerService.getPackageDetails(photographerId);
      if (!packages || packages.length === 0) {
        this.logger.warn(`No packages found for photographer ID: ${photographerId}`);
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'No packages found for the given photographer ID.',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      this.logger.log(`Package details fetched successfully for photographer ID: ${photographerId}`);
      return packages;
    } catch (error) {
      this.logger.error(`Error fetching package details for photographer ID: ${photographerId}`, error.message);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was a problem fetching the package details.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':packageId/package')
  async getPackageById(@Param('packageId') packageId: string) {
    try {
      this.logger.log(`Fetching package details for package ID: ${packageId}`);
      const packageDetails = await this.photographerService.getPackageById(packageId);
      if (!packageDetails) {
        this.logger.warn(`No package found for package ID: ${packageId}`);
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Package not found for the given package ID.',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      this.logger.log(`Package details fetched successfully for package ID: ${packageId}`);
      return packageDetails;
    } catch (error) {
      this.logger.error(`Error fetching package details for package ID: ${packageId}`, error.message);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was a problem fetching the package details.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('packages/delete')
  async deletePackage(@Body() dto: deletePackageDto) {
    try {
      this.logger.log(`Deleting package with ID: ${dto.packageId} for photographer ID: ${dto.photographerId}`);
      const deletedPackage = await this.photographerService.deletePackageDetails(dto);
      this.logger.log(`Package deleted successfully with ID: ${dto.packageId} for photographer ID: ${dto.photographerId}`);
      return deletedPackage;
    } catch (error) {
      this.logger.error(`Error deleting package with ID: ${dto.packageId} for photographer ID: ${dto.photographerId}`, error.message);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was a problem deleting the package.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Put(':packageId/coverphotos')
  async saveCoverPhotos(@Param('packageId') packageId: string, @Body() coverPhotos: Partial<Package>) {
    try {
      this.logger.log(`Saving cover photos for package ID: ${packageId}`);
      await this.photographerService.saveCoverPhotos(packageId, coverPhotos);
      this.logger.log(`Cover photos saved successfully for package ID: ${packageId}`);
    } catch (error) {
      this.logger.error(`Error saving cover photos for package ID: ${packageId}`, error.message);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was a problem saving the cover photos.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // ------- featured section controllers ---------
  @Get('featured/:photographerId')
  async getFeatured(@Param('photographerId') id: string) {
    try {
      this.logger.log(`Fetching featured photographer for photographer ID: ${id}`);
      const featuredPhotographer = await this.photographerService.getFeatured(id);
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
      await this.photographerService.updateFeatured(id, featured);
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
  // ------- testmonial controllers ---------

  @Post(':id/profile/testimonial')
  async createTestimonial(@Body() dto: CreateTestimonialDto) {
    return await this.photographerService.createTestimonial(dto);
  }

  @Get(':id/profile/testimonials')
  async getTestimonials(@Param('id') photographerId: string) {
    return await this.photographerService.getTestimonials(photographerId);
  }

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
  async getFeed(@Param('id') id: string, clientid: string) {
    return await this.photographerService.getFeed(id);
  }

  @Post(':id/feed/createFeed')
  async createFeedComponent(@Body() dto: FeedDto) {
    return await this.photographerService.createFeedComponent(dto);
  }

  @Patch(':id/feed/like')
  async feedLike(@Param('id') photographerId:string, @Body() dto: FeedLikeDto) {
    return await this.photographerService.feedLike(photographerId,dto);
  }

  @Patch(`:id/feed/createSave`)
  async feedSave(@Param('id') photographerId:string, @Body() dto: FeedSaveDto) {
    return await this.photographerService.feedSave(photographerId,dto);
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

  //------- booking controllers ---------

  @Get(':id/clientBookings')
  async getBookings(@Param('id') photographerId: string) {
    try {
      this.logger.log(`Fetching bookings for photographer ID: ${photographerId}`);
      const bookings = await this.photographerService.getBookings(photographerId);
      this.logger.log(`Bookings fetched successfully for photographer ID: ${photographerId}`);
      return bookings;
    } catch (error) {
      this.logger.error(`Error fetching bookings for photographer ID: ${photographerId}`, error.message);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was a problem fetching the bookings.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

 
  //------- event controllers ---------

  @Post(':id/event/create')
  async createEvents(@Body() dto: createEventDto) {
    try {
      this.logger.log(`Creating event for photographer with ID: ${dto.bookingId}`);
      const createdEvent = await this.photographerService.createEvents(dto);
      this.logger.log(`Event created successfully for photographer with ID: ${dto.bookingId}`);
      return createdEvent;
    } catch (error) {
      this.logger.error(`Error creating event for photographer with ID: ${dto.bookingId}`, error.message);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was a problem creating the event.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id/event/get')
  async getEvents(@Param('id') eventId: string) {
    try {
      this.logger.log(`Fetching events for photographer with ID: ${eventId}`);
      const events = await this.photographerService.getEvents(eventId);
      this.logger.log(`Events fetched successfully for photographer with ID: ${eventId}`);
      return events;
    } catch (error) {
      this.logger.error(`Error fetching events for photographer with ID: ${eventId}`, error.message);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was a problem fetching the events.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id/event/getEventById')
  async getEventById(@Param('eventId') eventId: string) {
    try {
      this.logger.log(`Fetching event by ID: ${eventId}`);
      const event = await this.photographerService.getEventById(eventId);
      this.logger.log(`Event with ID ${eventId} fetched successfully`);
      return event;
    } catch (error) {
      this.logger.error(`Error fetching event with ID ${eventId}: ${error.message}`);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was a problem fetching the event.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id/event/update')
  async updateEvents(@Body() dto: updateEventDto) {
    try {
      this.logger.log(`Updating event with ID: ${dto.eventId}`);
      const updatedEvent = await this.photographerService.updateEvents(dto);
      this.logger.log(`Event with ID ${dto.eventId} updated successfully`);
      return updatedEvent;
    } catch (error) {
      this.logger.error(`Error updating event with ID ${dto.eventId}: ${error.message}`);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was a problem updating the event.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id/event/delete')
  async deleteEvents(@Body() dto: deleteEventDto) {
    try {
      this.logger.log(`Deleting event with ID: ${dto.id}`);
      await this.photographerService.deleteEvents(dto);
      this.logger.log(`Event with ID ${dto.id} deleted successfully`);
      return { message: `Event with ID ${dto.id} deleted successfully` };
    } catch (error) {
      this.logger.error(`Error deleting event with ID ${dto.id}: ${error.message}`);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was a problem deleting the event.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ------- booking creation controllers ---------
  
  @Get(':id/bookingsCategory')
  async getBookingsCategory(@Param('id') id: string) {
    return await this.photographerService.getBookingsCategory(id);
  }

  @Get(':id/bookingsPackage')
  async getBookingsPackage(@Param('id') id: string) {
    return await this.photographerService.getBookingsPackage(id);
  }
  
  @Post(':id/clientBooking')
  async clientBooking(@Body() dto: ClientBookingDto){
    return await this.photographerService.clientBooking(dto);
  }

  // ------- getting like and save images controllers ---------

  @Get(':id/likeImages')
  async getLikedImages(@Param('id') id: string) {
      return await this.photographerService.getLikedImages(id);
  }

  @Get(':id/savedImages')
  async getSavedImages(@Param('id') id:string){
      return await this.photographerService.getSavedImages(id);
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
