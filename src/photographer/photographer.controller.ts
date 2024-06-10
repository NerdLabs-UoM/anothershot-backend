import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  Put,
  Delete,
  HttpException, HttpStatus, Logger
} from '@nestjs/common';
import { PhotographerService } from './photographer.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Package, Photographer } from '@prisma/client';
import { contactDetailsDto } from './dto/contactDetails.dto';
import { createPackageDto } from './dto/createPackage.dto';
import { updatePackageDto } from './dto/updatePackage.dto';
import { deletePackageDto } from './dto/deletePackage.dto';
import { AlbumsDto, updateAlbumDto, AlbumImagesDto } from './dto/album.dto';
import { bankDetailsDto } from './dto/bankDetails.dto';
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
