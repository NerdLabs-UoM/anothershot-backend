import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PhotographerCategory } from '@prisma/client';

// HomeService
@Injectable()
export class HomeService {
  private readonly logger = new Logger(HomeService.name);

  constructor(private prisma: PrismaService) {}

  // Get feed images
  async getFeed() {
    this.logger.log('Fetching feed images');
    try {
      return await this.prisma.feedImage.findMany({
        include: {
          photographer: {
            select: {
              user: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      this.logger.error(
        `Fetching feed images failed: ${error.message}`,
        error.stack
      );
      throw new InternalServerErrorException('Failed to fetch feed images');
    }
  }

  // Search for photographers
  async search(name: string, category: PhotographerCategory, location: string) {
    this.logger.log(
      `Searching for photographers with name: ${name}, category: ${category}, location: ${location}`
    );
    const where: Prisma.PhotographerWhereInput = {};

    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }
    if (category) {
      where.category = {
        has: category,
      };
    }
    if (location) {
      where.contactDetails = {
        address: {
          city: {
            contains: location,
            mode: 'insensitive',
          },
        },
      };
    }

    try {
      return await this.prisma.photographer.findMany({
        where,
        select: {
          id: false,
          userId: true,
          name: true,
          coverPhoto: false,
          bio: false,
          featured: false,
          category: true,
          createdAt: true,
          updatedAt: true,
          contactDetails: {
            select: {
              address: true,
              phoneNum1: true,
              email: true,
            },
          },
          testimonial: {
            select: {
              rating: true,
            },
          },
          user: {
            select: {
              image: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(`Search failed: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to search photographers');
    }
  }
}
