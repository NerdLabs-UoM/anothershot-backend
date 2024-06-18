import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTestimonialDto } from '../dto/testimonial.dto';
import {
  TestimonialVisibility,
} from '@prisma/client';
import { VisibilityDto } from '../dto/visibility.dto';
import {
  Injectable,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class TestimonialService {
  private readonly logger = new Logger(TestimonialService.name);

  constructor(
    private prisma: PrismaService,
  ) {}

  // ------- testmonial services ---------

  //Create or update a testimonial.

  async createTestimonial(dto: CreateTestimonialDto) {
    this.logger.log(
      `Creating or updating testimonial for photographer ID: ${dto.photographerId}`,
    );
    try {
      const existingTestimonial = await this.prisma.testimonial.findFirst({
        where: {
          photographerId: dto.photographerId,
          clientId: dto.clientId,
        },
      });

      if (existingTestimonial) {
        return await this.updateTestimonial(existingTestimonial.id, dto);
      } else {
        return await this.prisma.testimonial.create({
          data: {
            review: dto.review,
            rating: dto.rating,
            photographer: { connect: { userId: dto.photographerId } },
            client: { connect: { userId: dto.clientId } },
          },
        });
      }
    } catch (error) {
      this.logger.error(
        `Error creating/updating testimonial: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        'Failed to create or update testimonial',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //Get testimonials for a photographer.

  async getTestimonials(photographerId: string) {
    this.logger.log(
      `Fetching testimonials for photographer ID: ${photographerId}`,
    );
    try {
      return await this.prisma.testimonial.findMany({
        where: {
          photographerId: photographerId,
        },
        select: {
          id: true,
          review: true,
          rating: true,
          visibility: true,
          client: {
            select: {
              id: true,
              user: {
                select: {
                  image: true,
                  userName: true,
                },
              },
            },
          },
        },
        orderBy: {
          id: 'desc',
        },
      });
    } catch (error) {
      this.logger.error(
        `Error fetching testimonials: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        'Failed to fetch testimonials',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //Update an existing testimonial.

  async updateTestimonial(id: string, dto: CreateTestimonialDto) {
    this.logger.log(`Updating testimonial ID: ${id}`);
    try {
      return await this.prisma.testimonial.update({
        where: {
          id: id,
        },
        data: {
          ...dto,
          visibility: TestimonialVisibility.PRIVATE,
        },
      });
    } catch (error) {
      this.logger.error(
        `Error updating testimonial: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        'Failed to update testimonial',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //Update visibility of testimonials.

  async updateTestimonialVisibility(dto: VisibilityDto) {
    this.logger.log(
      `Updating testimonial visibility for testimonial IDs: ${dto.testimonialId.join(
        ', ',
      )}`,
    );
    try {
      const testimonials = await this.prisma.testimonial.findMany({
        where: {
          id: { in: dto.testimonialId },
        },
        select: {
          id: true,
          visibility: true,
        },
      });

      const updatePromises = testimonials.map((testimonial) => {
        return this.prisma.testimonial.update({
          where: { id: testimonial.id },
          data: {
            visibility:
              testimonial.visibility === TestimonialVisibility.PUBLIC
                ? TestimonialVisibility.PRIVATE
                : TestimonialVisibility.PUBLIC,
          },
        });
      });

      await Promise.all(updatePromises);
      this.logger.log('Testimonial visibility updated successfully');
    } catch (error) {
      this.logger.error(
        `Error updating testimonial visibility: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        'Failed to update testimonial visibility',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //Get public testimonials for a photographer.
  
  async getPublicTestimonials(photographerId: string) {
    this.logger.log(
      `Fetching public testimonials for photographer ID: ${photographerId}`,
    );
    try {
      return await this.prisma.testimonial.findMany({
        where: {
          photographerId: photographerId,
          visibility: TestimonialVisibility.PUBLIC,
        },
        select: {
          id: true,
          review: true,
          rating: true,
          client: {
            select: {
              id: true,
              user: {
                select: {
                  image: true,
                  userName: true,
                },
              },
            },
          },
        },
        orderBy: {
          id: 'desc',
        },
      });
    } catch (error) {
      this.logger.error(
        `Error fetching public testimonials: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        'Failed to fetch public testimonials',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  
}
