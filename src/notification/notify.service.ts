import { PrismaService } from 'src/prisma/prisma.service';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateNotifyDto, UpdateNotifyDto } from './dto/create-notify.dto';
import { AppGateway } from 'src/app.gateway';

@Injectable()
export class NotifyService {
  private readonly logger = new Logger(NotifyService.name);
  constructor(
    private prisma: PrismaService,

    private socketGateway: AppGateway,
  ) {}

  async getNotifications(id: string) {
    this.logger.log(`Fetching notifications for user ID: ${id}`);

    try {
      const notifications = await this.prisma.notification.findMany({
        where: {
          receiverId: id,
        },
        select: {
          id: true,
          type: true,
          title: true,
          description: true,
          read: true,
          createdAt: true,
          receiver: {
            select: {
              id: true,
            },
          },
        },
      });

      if (notifications.length === 0) {
        this.logger.warn(`No notifications found for user ID: ${id}`);
      } else {
        this.logger.log(
          `Fetched ${notifications.length} notifications for user ID: ${id}`,
        );
      }

      return notifications;
    } catch (error) {
      this.logger.error(
        `Failed to fetch notifications for user ID: ${id}`,
        error.stack,
      );
      throw new HttpException(
        'Failed to fetch notifications',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateNotify(dto: UpdateNotifyDto) {
    this.logger.log(
      `Updating notification ID: ${dto.notifyId} with read status: ${dto.read}`,
    );

    try {
      const updatedNotify = await this.prisma.notification.update({
        where: {
          id: dto.notifyId,
        },
        data: {
          read: dto.read,
        },
      });

      this.logger.log(`Notification ID: ${dto.notifyId} updated successfully`);
      return updatedNotify;
    } catch (error) {
      this.logger.error(
        `Failed to update notification ID: ${dto.notifyId}`,
        error.stack,
      );
      if (error.code === 'P2025') {
        // Prisma specific error code for record not found
        throw new NotFoundException('Notification not found');
      } else {
        throw new HttpException(
          'Failed to update notification',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async deleteNotify(notifyId: string, userId: string) {
    this.logger.log(
      `Attempting to delete notification ID: ${notifyId} for user ID: ${userId}`,
    );

    try {
      // Check if the notification exists and belongs to the user
      const notification = await this.prisma.notification.findUnique({
        where: {
          id: notifyId,
        },
      });

      if (!notification) {
        this.logger.warn(`Notification not found with ID: ${notifyId}`);
        throw new NotFoundException('Notification not found');
      }

      if (notification.receiverId !== userId) {
        this.logger.warn(
          `User ID: ${userId} is not authorized to delete notification ID: ${notifyId}`,
        );
        throw new HttpException('Unauthorized action', HttpStatus.UNAUTHORIZED);
      }

      // Delete the notification
      const deletedNotification = await this.prisma.notification.delete({
        where: {
          id: notifyId,
        },
      });

      this.logger.log(
        `Notification ID: ${notifyId} deleted successfully for user ID: ${userId}`,
      );
      return deletedNotification;
    } catch (error) {
      this.logger.error(
        `Failed to delete notification ID: ${notifyId} for user ID: ${userId}`,
        error.stack,
      );
      if (error.code === 'P2025') {
        // Prisma specific error code for record not found
        throw new NotFoundException('Notification not found');
      } else {
        throw new HttpException(
          'Failed to delete notification',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async createNotification(dto: CreateNotifyDto) {
    this.logger.log(
      `Creating notification for receiver ID: ${dto.receiverId} from sender ID: ${dto.senderId}`,
    );

    try {
      // Fetch sender's name
      const sender = await this.prisma.user.findUnique({
        where: {
          id: dto.senderId,
        },
      });

      if (!sender) {
        this.logger.warn(`Sender not found with ID: ${dto.senderId}`);
        throw new NotFoundException('Sender not found');
      }

      // Build notification title based on whether the sender and receiver are the same
      const title =
        dto.senderId === dto.receiverId
          ? `You ${dto.title}`
          : `${sender.userName} ${dto.title}`;

      // Create the notification
      const notification = await this.prisma.notification.create({
        data: {
          receiver: {
            connect: {
              id: dto.receiverId,
            },
          },
          type: dto.type,
          title: title,
          description: dto.description || '',
        },
      });

      // Notify via socket
      await this.socketGateway.handleNewNotification(notification);

      this.logger.log(
        `Notification created successfully for receiver ID: ${dto.receiverId}`,
      );
      return notification;
    } catch (error) {
      this.logger.error('Failed to create notification', error.stack);
      throw new HttpException(
        'Failed to create notification',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
