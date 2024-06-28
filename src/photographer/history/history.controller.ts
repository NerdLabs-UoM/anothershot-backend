import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HistoryService } from './history.service';

@Controller('api/photographer')
export class HistoryController {
  private readonly logger = new Logger(HistoryController.name);

  constructor(private historyService: HistoryService) {}

  // ------- getting like and save images controllers ---------

  @Get(':id/likeImages')
  async getLikedImages(@Param('id') id: string) {
    this.logger.log(`Fetching liked images for user with ID: ${id}`);
    try {
      return await this.historyService.getLikedImages(id);
    } catch (error) {
      this.logger.error(
        `Failed to fetch liked images for user with ID: ${id}`,
        error.stack
      );
      throw new HttpException(
        'Failed to fetch liked images',
        HttpStatus.NOT_FOUND
      );
    }
  }

  @Get(':id/savedImages')
  async getSavedImages(@Param('id') id: string) {
    this.logger.log(`Fetching saved images for user with ID: ${id}`);
    try {
      return await this.historyService.getSavedImages(id);
    } catch (error) {
      this.logger.error(
        `Failed to fetch saved images for user with ID: ${id}`,
        error.stack
      );
      throw new HttpException(
        'Failed to fetch saved images',
        HttpStatus.NOT_FOUND
      );
    }
  }
}
