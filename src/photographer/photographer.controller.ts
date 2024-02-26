import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { PhotographerService } from './photographer.service';
import { UpdatePhotographerDto } from './dto/photographer.dto';
import { Photographer, PhotographerCategory, User} from '@prisma/client';

@Controller('api/photographer')
export class PhotographerController {
  constructor(private photographerService: PhotographerService) {}

  @Get('getallusers')
  async getAllUsers() {
    return await this.photographerService.findall();
  }
  @Get('getallcategories')
  getAllCategories() {
    return PhotographerCategory;
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

  @Put(':id/categories')
  async updateCategory(
    @Param('id') id: string,
    @Body() data: Partial<Photographer>,
  ) {
    return await this.photographerService.updateCategory(id, data);
  }

  @Put(':id')
  async updateData(
    @Param('id') id: string,
    @Body() data: Partial<Photographer>,
  ) {
    return await this.photographerService.updateUser(id, data);
  }

  
}
