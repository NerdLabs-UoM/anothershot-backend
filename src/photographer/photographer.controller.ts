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
} from '@nestjs/common';
import { CreateTestimonialDto } from './dto/testimonial.dto';
import { VisibilityDto } from './dto/visibility.dto';
import { PhotographerService } from './photographer.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
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
import { ReportDto } from './dto/report.dto';
import { bankDetailsDto } from './dto/bankDetails.dto';
import { ClientBookingDto } from './dto/clientBooking.dto';

@Controller('api/photographer')
export class PhotographerController {

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

  @Post('report/:id')
  async createReport(@Param('id') id: string, @Body() dto: ReportDto) {
    return await this.photographerService.createReport(id, dto);
  }

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
  async feedLike(@Body() dto: FeedLikeDto) {
    return await this.photographerService.feedLike(dto);
  }

  @Patch(`:id/feed/createSave`)
  async feedSave(@Body() dto: FeedSaveDto) {
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
}
