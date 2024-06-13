import { PrismaService } from 'src/prisma/prisma.service';
import {
  Injectable,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class HistoryService {
  private readonly logger = new Logger(HistoryService.name);

  constructor(
    private prisma: PrismaService,
  ) {}

    // ------- history page services ---------

  //Fetches the liked feed images for a specific user
   
  async getLikedImages(id: string) {
    try {
      this.logger.log(`Fetching liked images for user with ID: ${id}`);

      const user = await this.prisma.user.findMany({
        where: {
          id: id,
        },
        select: {
          likedFeedImages: {
            select: {
              id: true,
              imageUrl: true,
              photographerId: true,
            },
          },
        },
      });

      if (user.length === 0) {
        this.logger.warn(`No user found with ID: ${id}`);
      }

      this.logger.log(`Successfully fetched liked images for user with ID: ${id}`);
      return user;
    } catch (error) {
      this.logger.error(`Failed to fetch liked images for user with ID: ${id}`, error.stack);
      throw new HttpException('Failed to fetch liked images', HttpStatus.NOT_FOUND);
    }
  }

  //Fetches the saved feed images for a specific user
   
  async getSavedImages(id: string) {
    try {
      this.logger.log(`Fetching saved images for user with ID: ${id}`);

      const user = await this.prisma.user.findMany({
        where: {
          id: id,
        },
        select: {
          savedFeedImages: {
            select: {
              id: true,
              imageUrl: true,
              photographerId: true,
            },
          },
        },
      });

      if (user.length === 0) {
        this.logger.warn(`No user found with ID: ${id}`);
      }

      this.logger.log(`Successfully fetched saved images for user with ID: ${id}`);
      return user;
    } catch (error) {
      this.logger.error(`Failed to fetch saved images for user with ID: ${id}`, error.stack);
      throw new HttpException('Failed to fetch saved images', HttpStatus.NOT_FOUND);
    }
  }

}

