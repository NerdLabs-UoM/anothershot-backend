import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Logger,
} from '@nestjs/common';
import { PhotographerService } from './photographer.service';
import { Photographer } from '@prisma/client';

@Controller('api/photographer')
export class PhotographerController {
  private readonly logger = new Logger(PhotographerController.name);

  constructor(private photographerService: PhotographerService) {}

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
    @Body() data: Partial<Photographer>
  ) {
    return await this.photographerService.updateUser(id, data);
  }

  @Post(':id/updateHeroSection')
  async updateHeroSection(
    @Param('id') id: string,
    @Body() data: Partial<Photographer>
  ) {
    return await this.photographerService.updateHeroSection(id, data);
  }
  @Put(':id/cover-photo')
  async updateCoverPhoto(
    @Param('id') id: string,
    @Body() data: Partial<Photographer>
  ) {
    return await this.photographerService.updateCoverPhoto(id, data);
  }

  @Put(':id/profile-picture')
  async updateProfilePicture(
    @Param('id') id: string,
    @Body() data: Partial<Photographer>
  ) {
    return await this.photographerService.updateProfilePicture(id, data);
  }
}
