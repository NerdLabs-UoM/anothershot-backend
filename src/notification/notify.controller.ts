import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Delete,
  Post,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { NotifyService } from './notify.service';
import { UpdateNotifyDto, CreateNotifyDto } from './dto/create-notify.dto';

@Controller('api/notification')
export class NotifyController {
  private readonly logger = new Logger(NotifyController.name);
  constructor(private notifyService: NotifyService) {}

  @Get(':id')
  async getNotifications(@Param('id') userId: string) {
    this.logger.log(`Fetching notifications for user ID: ${userId}`);

    try {
      const notifications = await this.notifyService.getNotifications(userId);
      this.logger.log(
        `Successfully fetched notifications for user ID: ${userId}`
      );
      return notifications;
    } catch (error) {
      this.logger.error(
        `Failed to fetch notifications for user ID: ${userId}`,
        error.stack
      );
      throw new HttpException(
        'Failed to fetch notifications',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Patch('/update')
  async updateNotify(@Body() dto: UpdateNotifyDto) {
    this.logger.log(`Updating notification with data: ${JSON.stringify(dto)}`);

    try {
      const updatedNotification = await this.notifyService.updateNotify(dto);
      this.logger.log(`Successfully updated notification with ID: ${dto}`);
      return updatedNotification;
    } catch (error) {
      this.logger.error(
        `Failed to update notification with ID: ${dto}`,
        error.stack
      );
      throw new HttpException(
        'Failed to update notification',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete('/delete/:notifyId/:userId')
  async deleteNotify(
    @Param('notifyId') notifyId: string,
    @Param('userId') userId: string
  ) {
    this.logger.log(
      `Attempting to delete notification ID: ${notifyId} for user ID: ${userId}`
    );

    try {
      const deletedNotification = await this.notifyService.deleteNotify(
        notifyId,
        userId
      );
      this.logger.log(
        `Successfully deleted notification ID: ${notifyId} for user ID: ${userId}`
      );
      return deletedNotification;
    } catch (error) {
      this.logger.error(
        `Failed to delete notification ID: ${notifyId} for user ID: ${userId}`,
        error.stack
      );
      throw new HttpException(
        'Failed to delete notification',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('create')
  async createNotification(@Body() dto: CreateNotifyDto) {
    this.logger.log(`Creating notification with data: ${JSON.stringify(dto)}`);

    try {
      const newNotification = await this.notifyService.createNotification(dto);
      this.logger.log(
        `Successfully created notification with ID: ${newNotification.id}`
      );
      return newNotification;
    } catch (error) {
      this.logger.error(`Failed to create notification`, error.stack);
      throw new HttpException(
        'Failed to create notification',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
