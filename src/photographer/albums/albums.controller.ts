import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, Post, Put } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumImagesDto, AlbumsDto, UpdateAlbumCoverDto, updateAlbumDto } from '../dto/album.dto';

@Controller('api/photographer')
export class AlbumsController {
    private readonly logger = new Logger(AlbumsController.name);
    
    constructor(private albumsService:AlbumsService) {}

    @Post(':id/createalbum')
  async createAlbum(@Body() dto: AlbumsDto) {
    this.logger.log(`Received request to create a new album with data: ${JSON.stringify(dto)}`);
    try {
      const newAlbum = await this.albumsService.createAlbum(dto);
      this.logger.log('Successfully created a new album');
      return newAlbum;
    } catch (error) {
      this.logger.error('Failed to create a new album', error.stack);
      throw new HttpException('Error creating album', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id/editalbum')
  async editAlbum(@Body() dto: updateAlbumDto) {
    this.logger.log(`Received request to edit album with data: ${JSON.stringify(dto)}`);
    try {
      const updatedAlbum = await this.albumsService.editAlbum(dto);
      this.logger.log(`Successfully updated album: ${JSON.stringify(updatedAlbum)}`);
      return updatedAlbum;
    } catch (error) {
      this.logger.error(`Failed to edit album: ${error.message}`, error.stack);
      throw new HttpException('Error editing album', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id/getalbum')
  async getAlbum(@Param('id') id: string) {
    this.logger.log(`Received request to get album with ID: ${id}`);
    try {
      const album = await this.albumsService.getAlbum(id);
      this.logger.log(`Successfully retrieved album: ${JSON.stringify(album)}`);
      return album;
    } catch (error) {
      this.logger.error(`Failed to get album with ID ${id}: ${error.message}`, error.stack);
      throw new HttpException('Error retrieving album', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  @Get(':id/getalbums')
  async getAlbums(@Param('id') id: string) {
    this.logger.log(`Received request to get albums for photographer ID: ${id}`);
    try {
      const albums = await this.albumsService.getAlbums(id);
      this.logger.log(`Successfully retrieved albums: ${JSON.stringify(albums)}`);
      return albums;
    } catch (error) {
      this.logger.error(`Failed to get albums for photographer ID ${id}: ${error.message}`, error.stack);
      throw new HttpException('Error retrieving albums', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id/getimages')
  async getImages(@Param('id') id: string) {
    this.logger.log(`Received request to get images for album ID: ${id}`);
    try {
      const images = await this.albumsService.getImages(id);
      this.logger.log(`Successfully retrieved images: ${JSON.stringify(images)}`);
      return images;
    } catch (error) {
      this.logger.error(`Failed to get images for album ID ${id}: ${error.message}`, error.stack);
      throw new HttpException('Error retrieving images', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id/deletealbum')
  async deleteAlbum(@Param('id') id: string) {
    this.logger.log(`Received request to delete album with ID: ${id}`);
    try {
      const result = await this.albumsService.deleteAlbum(id);
      this.logger.log(`Successfully deleted album with ID: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to delete album with ID ${id}: ${error.message}`, error.stack);
      throw new HttpException('Error deleting album', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post(':id/addimages')
  async addImages(@Body() dto: AlbumImagesDto) {
    this.logger.log(`Received request to add images to album with data: ${JSON.stringify(dto)}`);
    try {
      const updatedAlbum = await this.albumsService.addImages(dto);
      this.logger.log(`Successfully added images to album: ${JSON.stringify(updatedAlbum)}`);
      return updatedAlbum;
    } catch (error) {
      this.logger.error(`Failed to add images to album: ${error.message}`, error.stack);
      throw new HttpException('Error adding images to album', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id/deleteimage')
  async deleteImage(@Param('id') id: string) {
    this.logger.log(`Received request to delete image with ID: ${id}`);
    try {
      const result = await this.albumsService.deleteImage(id);
      this.logger.log(`Successfully deleted image with ID: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to delete image with ID ${id}: ${error.message}`, error.stack);
      throw new HttpException('Error deleting image', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('updatecoverImage')
  async updateAlbumCover(@Body() dto:UpdateAlbumCoverDto) {
    this.logger.log(`Received request to update cover image for album ID: ${dto.albumId}`);

    try {
      const updatedAlbum = await this.albumsService.updateAlbumCover(dto);
      this.logger.log(`Successfully updated cover image for album ID: ${dto.albumId}`);
      return updatedAlbum;
    } catch (error) {
      this.logger.error(`Failed to update cover image for album ID: ${dto.albumId}`, error.stack);
      throw new HttpException('Failed to update cover image', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
