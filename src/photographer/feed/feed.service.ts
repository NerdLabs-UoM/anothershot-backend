import { PrismaService } from 'src/prisma/prisma.service';

import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { FeedDto } from '../dto/feed.dto';
import { FeedLikeDto } from '../dto/feedLike.dto';
import { FeedSaveDto } from '../dto/feedSave.dto';
import { DeleteFeedDto } from '../dto/deleteFeed.dto';
import { CaptionDto } from '../dto/caption.dto';

@Injectable()
export class FeedService {
  private readonly logger = new Logger(FeedService.name);

  constructor(private prisma: PrismaService) {}

  // ------- feed services ---------

  //Fetches the feed for a specific photographer

  async getFeed(id: string) {
    try {
      this.logger.log(`Fetching feed for photographer ID: ${id}`);

      const feed = await this.prisma.feedImage.findMany({
        where: {
          photographerId: id,
        },
        select: {
          id: true,
          imageUrl: true,
          likeCount: true,
          saveCount: true,
          caption: true,
          photographerId: true,
          photographer: {
            select: {
              name: true,
              user: {
                select: {
                  image: true,
                },
              },
            },
          },
          likedUserIds: true,
          savedUserIds: true,
        },
        orderBy: {
          id: 'desc',
        },
      });

      this.logger.log(
        `Successfully fetched ${feed.length} feed items for photographer ID: ${id}`
      );
      return feed;
    } catch (error) {
      this.logger.error(
        `Failed to fetch feed for photographer ID: ${id}`,
        error.stack
      );
      throw new HttpException('Failed to fetch feed', HttpStatus.NOT_FOUND);
    }
  }

  //Creates a new feed component.

  async createFeedComponent(dto: FeedDto) {
    try {
      this.logger.log(
        `Creating feed component for photographer ID: ${dto.photographerId}`
      );

      const newFeedComponent = await this.prisma.feedImage.create({
        data: {
          imageUrl: dto.image,
          photographer: {
            connect: {
              userId: dto.photographerId,
            },
          },
        },
      });

      this.logger.log(
        `Successfully created feed component with ID: ${newFeedComponent.id} for photographer ID: ${dto.photographerId}`
      );
      return newFeedComponent;
    } catch (error) {
      this.logger.error(
        `Failed to create feed component for photographer ID: ${dto.photographerId}`,
        error.stack
      );
      throw new HttpException(
        'Failed to create feed component',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  //Likes or unlikes a feed image

  async feedLike(dto: FeedLikeDto) {
    try {
      this.logger.log(
        `Processing like for feed ID: ${dto.feedId} by user ID: ${dto.userId}`
      );

      // Check if the like already exists
      const existingLike = await this.prisma.feedImage.findFirst({
        where: {
          id: dto.feedId,
          likedUserIds: {
            has: dto.userId,
          },
        },
      });

      // Fetch the feed to get the current like count
      const feed = await this.prisma.feedImage.findUnique({
        where: {
          id: dto.feedId,
        },
        select: {
          id: true,
          likeCount: true,
        },
      });

      if (!feed) {
        this.logger.warn(`Feed ID: ${dto.feedId} not found`);
        throw new Error('Feed not found');
      }

      let likeCount = feed.likeCount;

      if (dto.like) {
        if (!existingLike) {
          // Add the like
          await this.prisma.feedImage.update({
            where: {
              id: dto.feedId,
            },
            data: {
              likedUserIds: {
                push: dto.userId,
              },
              likes: {
                connect: { id: dto.userId },
              },
            },
          });
          likeCount++;
          this.logger.log(
            `User ID: ${dto.userId} liked feed ID: ${dto.feedId}`
          );
        }
      } else {
        if (existingLike) {
          // Remove the like
          await this.prisma.feedImage.update({
            where: {
              id: dto.feedId,
            },
            data: {
              likedUserIds: {
                set: existingLike.likedUserIds.filter(
                  (id) => id !== dto.userId
                ),
              },
            },
          });
          likeCount--;
          await this.prisma.user.update({
            where: { id: dto.userId },
            data: {
              likedFeedImages: {
                disconnect: { id: dto.feedId },
              },
            },
          });
          this.logger.log(
            `User ID: ${dto.userId} unliked feed ID: ${dto.feedId}`
          );
        }
      }

      // Update the like count
      const updatedFeed = await this.prisma.feedImage.update({
        where: {
          id: dto.feedId,
        },
        data: {
          likeCount: likeCount,
        },
      });

      this.logger.log(
        `Updated like count for feed ID: ${dto.feedId} to ${likeCount}`
      );
      return updatedFeed;
    } catch (error) {
      this.logger.error(
        `Failed to process like for feed ID: ${dto.feedId} by user ID: ${dto.userId}`,
        error.stack
      );
      throw new HttpException('Failed to process like', HttpStatus.BAD_REQUEST);
    }
  }

  //Saves or unsaves a feed image.

  async feedSave(photographerId: string, dto: FeedSaveDto) {
    try {
      this.logger.log(
        `Processing save for feed ID: ${dto.feedId} by user ID: ${dto.userId}`
      );

      // Check if the save already exists
      const existingSave = await this.prisma.feedImage.findFirst({
        where: {
          id: dto.feedId,
          savedUserIds: {
            has: dto.userId,
          },
        },
      });

      // Fetch the feed to get the current save count
      const feed = await this.prisma.feedImage.findUnique({
        where: {
          id: dto.feedId,
        },
        select: {
          id: true,
          saveCount: true,
        },
      });

      if (!feed) {
        this.logger.warn(`Feed ID: ${dto.feedId} not found`);
        throw new Error('Feed not found');
      }

      let saveCount = feed.saveCount;

      if (dto.save) {
        if (!existingSave) {
          // Add the save
          await this.prisma.feedImage.update({
            where: {
              id: dto.feedId,
            },
            data: {
              savedUserIds: {
                push: dto.userId,
              },
              saves: {
                connect: { id: dto.userId },
              },
            },
          });
          saveCount++;
          this.logger.log(
            `User ID: ${dto.userId} saved feed ID: ${dto.feedId}`
          );
        }
      } else {
        if (existingSave) {
          // Remove the save
          await this.prisma.feedImage.update({
            where: {
              id: existingSave.id,
            },
            data: {
              savedUserIds: {
                set: existingSave.savedUserIds.filter(
                  (id) => id !== dto.userId
                ),
              },
            },
          });
          saveCount--;
          await this.prisma.user.update({
            where: { id: dto.userId },
            data: {
              savedFeedImages: {
                disconnect: { id: dto.feedId },
              },
            },
          });
          this.logger.log(
            `User ID: ${dto.userId} unsaved feed ID: ${dto.feedId}`
          );
        }
      }

      // Update the save count
      const updatedFeed = await this.prisma.feedImage.update({
        where: {
          id: dto.feedId,
        },
        data: {
          saveCount: saveCount,
        },
      });

      this.logger.log(
        `Updated save count for feed ID: ${dto.feedId} to ${saveCount}`
      );
      return updatedFeed;
    } catch (error) {
      this.logger.error(
        `Failed to process save for feed ID: ${dto.feedId} by user ID: ${dto.userId}`,
        error.stack
      );
      throw new HttpException('Failed to process save', HttpStatus.BAD_REQUEST);
    }
  }

  //Deletes a feed image.

  async deleteFeed(dto: DeleteFeedDto) {
    try {
      this.logger.log(`Deleting feed with ID: ${dto.feedId}`);

      const deletedFeed = await this.prisma.feedImage.delete({
        where: {
          id: dto.feedId,
        },
      });

      this.logger.log(`Successfully deleted feed with ID: ${dto.feedId}`);
      return deletedFeed;
    } catch (error) {
      this.logger.error(
        `Failed to delete feed with ID: ${dto.feedId}`,
        error.stack
      );
      throw new HttpException('Failed to delete feed', HttpStatus.BAD_REQUEST);
    }
  }

  //Fetches the header information for a specific photographer.

  async getFeedHeader(id: string) {
    try {
      this.logger.log(`Fetching header for photographer with user ID: ${id}`);

      const header = await this.prisma.photographer.findUnique({
        where: {
          userId: id,
        },
        select: {
          name: true,
          user: {
            select: {
              image: true,
            },
          },
        },
      });

      if (!header) {
        this.logger.warn(`Photographer with user ID: ${id} not found`);
        throw new Error('Photographer not found');
      }

      this.logger.log(
        `Successfully fetched header for photographer with user ID: ${id}`
      );
      return header;
    } catch (error) {
      this.logger.error(
        `Failed to fetch header for photographer with user ID: ${id}`,
        error.stack
      );
      throw new HttpException('Failed to fetch header', HttpStatus.NOT_FOUND);
    }
  }

  //Updates the caption of a feed image

  async updateCaption(dto: CaptionDto) {
    try {
      this.logger.log(`Updating caption for feed ID: ${dto.feedId}`);

      const updatedFeed = await this.prisma.feedImage.update({
        where: {
          id: dto.feedId,
        },
        data: {
          caption: dto.caption,
        },
      });

      this.logger.log(
        `Successfully updated caption for feed ID: ${dto.feedId}`
      );
      return updatedFeed;
    } catch (error) {
      this.logger.error(
        `Failed to update caption for feed ID: ${dto.feedId}`,
        error.stack
      );
      throw new HttpException(
        'Failed to update caption',
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
