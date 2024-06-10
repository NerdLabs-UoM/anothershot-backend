import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
    HttpException, HttpStatus, Logger
  } from '@nestjs/common';

  import { FeedDto } from '../dto/feed.dto';
  import { FeedLikeDto } from '../dto/feedLike.dto';
  import { FeedSaveDto } from '../dto/feedSave.dto';
  import { DeleteFeedDto } from '../dto/deleteFeed.dto';
  import { CaptionDto } from '../dto/caption.dto';

  import { FeedService } from './feed.service';
  
  
  @Controller('api/photographer')
  export class FeedController {
  
    private readonly logger = new Logger(FeedController.name);
  
    constructor(private feedService: FeedService) { }

     // ------- feed controllers ---------
  
     @Get(':id/feed')
     async getFeed(
         @Param('id') id: string
     ) {
         this.logger.log(`Getting feed for photographer with ID: ${id}`);
         try {
             return await this.feedService.getFeed(id);
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
             return await this.feedService.createFeedComponent(dto);
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
             return await this.feedService.feedLike(dto);
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
             return await this.feedService.feedSave(photographerId, dto);
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
             return await this.feedService.deleteFeed(dto);
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
             return await this.feedService.getFeedHeader(id);
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
             return await this.feedService.updateCaption(dto);
         } catch (error) {
             throw new HttpException(`Error updating caption for feed with ID: ${dto.feedId}`, HttpStatus.BAD_REQUEST);
         }
     }
  }
  
