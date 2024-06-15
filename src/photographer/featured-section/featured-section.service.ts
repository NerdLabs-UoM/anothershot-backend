import { Injectable, NotFoundException, Logger, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { Photographer } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class FeaturedSectionService {  private readonly logger = new Logger(FeaturedSectionService.name);

  constructor(
    private prisma: PrismaService,
    
  ) { }
  // ------- featured section services ---------

  async getFeatured(userId: string) {
    try {
      this.logger.log(`Fetching featured photographer for user ID: ${userId}`);
      const photographer = await this.prisma.photographer.findUnique({
        where: {
          userId: userId,
        },
      });
      if (!photographer) {
        this.logger.warn(`Featured photographer not found for user ID: ${userId}`);
        throw new NotFoundException('Featured photographer not found');
      }
      this.logger.log(`Featured photographer fetched successfully for user ID: ${userId}`);
      return photographer;
    } catch (error) {
      this.logger.error(`Error fetching featured photographer for user ID: ${userId}`, error);
      throw error;
    }
  }

  async updateFeatured(id: string, data: Partial<Photographer>) {
    try {
      this.logger.log(`Updating featured photographer with user ID: ${id}`);
      const updatedPhotographer = await this.prisma.photographer.update({
        where: {
          userId: id,
        },
        data,
      });
      this.logger.log(`Featured photographer updated successfully with user ID: ${id}`);
      return updatedPhotographer;
    } catch (error) {
      this.logger.error(`Error updating featured photographer with user ID: ${id}`, error);
      throw error;
    }
  }
}
