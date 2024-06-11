import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTestimonialDto } from './dto/testimonial.dto';
import {
  Package,
  TestimonialVisibility,
  PhotographerCategory,
} from '@prisma/client';
import { VisibilityDto } from './dto/visibility.dto';
import { Injectable, NotFoundException, Logger, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';

import { Photographer, User } from '@prisma/client';
import { FeedDto } from './dto/feed.dto';
import { FeedLikeDto } from './dto/feedLike.dto';
import { FeedSaveDto } from './dto/feedSave.dto';
import { DeleteFeedDto } from './dto/deleteFeed.dto';
import { CaptionDto } from './dto/caption.dto';
import { bankDetailsDto } from './dto/bankDetails.dto';
import { AlbumImagesDto, AlbumsDto, updateAlbumDto } from './dto/album.dto';

import { NotifyService } from '../notification/notify.service';
import { CreateNotifyDto } from 'src/notification/dto/create-notify.dto';
import { ClientBookingDto } from './dto/clientBooking.dto';
import { EarningsDto } from './dto/earnings.dto';

@Injectable()
export class PhotographerService {
  private readonly logger = new Logger(PhotographerService.name);

  constructor(
    private prisma: PrismaService,
    private NotifyService: NotifyService,
  ) { }

  //------ photographer services -----------

  async getPhotographer(userId: string) {
    return await this.prisma.photographer.findUnique({
      where: {
        userId: userId,
      },
      include: {
        user: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.photographer.findMany({
      include: {
        user: true,
      },
    });
  }

  // ------hero section services ------

  async updateUser(userId: string, data: Partial<Photographer>) {
    return await this.prisma.photographer.update({
      where: { userId: userId },
      data,
    });
  }

  async updateCoverPhoto(userId: string, data: Partial<Photographer>) {
    return await this.prisma.photographer.update({
      where: {
        userId: userId,
      },
      data,
    });
  }

  async updateProfilePicture(
    userId: string,
    data: Partial<Photographer & { image: string }>,
  ) {
    return await this.prisma.photographer.update({
      where: {
        userId: userId,
      },
      include: {
        user: true,
      },
      data: {
        user: {
          update: {
            image: data.image,
          },
        },
      },
    });
  }


  async updateHeroSection(userId:string, data:Partial<Photographer> & Partial<User>){

    if(data.image){
      return await this.prisma.user.update({
        where: { id: userId },
        data: {
          image: data.image,
        },
      });
    }
    else{
      return await this.prisma.photographer.update({
        where: { userId: userId },
        data,
      });
    }
  
  }

  
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
              name: true,
              user: {
                select: {
                  image: true,
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

  // ------- settings services ---------

  async getBankDetails(photographerId: string) {
    return await this.prisma.bankDetails.findUnique({
      where: {
        photographerId: photographerId,
      },
      select: {
        id: true,
        bankName: true,
        accountNumber: true,
        accountName: true,
        accountBranch: true,
        accountBranchCode: true,
      },
    });
  }

  async updateBankDetails(userId: string, dto: bankDetailsDto) {
    const excistingBankDetails = await this.prisma.bankDetails.findUnique({
      where: { photographerId: userId },
    });

    if (excistingBankDetails) {
      await this.prisma.bankDetails.update({
        where: { photographerId: userId },
        data: {
          bankName: dto.bankName,
          accountNumber: dto.accountNumber,
          accountName: dto.accountName,
          accountBranch: dto.accountBranch,
          accountBranchCode: dto.accountBranchCode
            ? dto.accountBranchCode
            : null,
        },
      });
    } else {
      await this.prisma.bankDetails.create({
        data: {
          photographer: {
            connect: {
              userId: userId,
            },
          },
          bankName: dto.bankName,
          accountNumber: dto.accountNumber,
          accountName: dto.accountName,
          accountBranch: dto.accountBranch,
          accountBranchCode: dto.accountBranchCode
            ? dto.accountBranchCode
            : undefined,
        },
      });
    }
    return await this.prisma.bankDetails.findUnique({
      where: { photographerId: userId },
    });
  }

  async getAllCategories() {
    return PhotographerCategory;
  }

  async getCategoryById(id: string) {
    return this.prisma.photographer.findUnique({
      where: {
        userId: id,
      },
      select: {
        category: true,
      },
    });
  }

  async updateCategory(userId: string, data: Partial<Photographer>) {
    return await this.prisma.photographer.update({
      where: {
        userId: userId,
      },
      include: {
        user: true,
      },
      data: {
        category: {
          set: data.category,
        },
      },
    });
  }

  // ------- album services ---------

  async createAlbum(dto: AlbumsDto) {
    return await this.prisma.album.create({
      data: {
        name: dto.name,
        description: dto.description,
        visibility: dto.visibility,
        price: dto.price,
        photographer: {
          connect: {
            userId: dto.photographerId,
          },
        },
      },
      include: {
        images: true,
      },
    });
  }

  async editAlbum(dto: updateAlbumDto) {
    return await this.prisma.album.update({
      where: {
        id: dto.albumId,
      },
      data: {
        name: dto.name,
        description: dto.description,
        visibility: dto.visibility,
        price: dto.price,
      },
    });
  }

  async getAlbums(id: string) {
    return this.prisma.album.findMany({
      where: {
        photographerId: id,
      },
      include: {
        images: true,
      },
    });
  }

  async getAlbum(id: string) {
    return this.prisma.album.findMany({
      where: {
        id: id,
      },
    });
  }

  async getImages(id: string) {
    return this.prisma.albumImage.findMany({
      where: {
        albumId: id,
      },
    });
  }

  async deleteAlbum(id: string) {
    return await this.prisma.album.delete({
      where: {
        id: id,
      },
    });
  }

  async addImages(dto: AlbumImagesDto) {
    const album = await this.prisma.album.findUnique({
      where: {
        id: dto.albumId,
      },
    });

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    const images = await Promise.all(
      dto.images.map((imageUrl) =>
        this.prisma.albumImage.create({
          data: {
            image: imageUrl,
            album: {
              connect: {
                id: dto.albumId,
              },
            },
          },
        }),
      ),
    );

    return images;
  }

  async deleteImage(id: string) {
    return await this.prisma.albumImage.delete({
      where: {
        id: id,
      },
    });
  }

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
        `Successfully fetched ${feed.length} feed items for photographer ID: ${id}`,
      );
      return feed;
    } catch (error) {
      this.logger.error(
        `Failed to fetch feed for photographer ID: ${id}`,
        error.stack,
      );
      throw new HttpException('Failed to fetch feed', HttpStatus.NOT_FOUND);
    }
  }

  //Creates a new feed component.

  async createFeedComponent(dto: FeedDto) {
    try {
      this.logger.log(
        `Creating feed component for photographer ID: ${dto.photographerId}`,
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
        `Successfully created feed component with ID: ${newFeedComponent.id} for photographer ID: ${dto.photographerId}`,
      );
      return newFeedComponent;
    } catch (error) {
      this.logger.error(
        `Failed to create feed component for photographer ID: ${dto.photographerId}`,
        error.stack,
      );
      throw new HttpException(
        'Failed to create feed component',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //Likes or unlikes a feed image

  async feedLike(photographerId: string, dto: FeedLikeDto) {
    try {
      this.logger.log(
        `Processing like for feed ID: ${dto.feedId} by user ID: ${dto.userId}`,
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
            `User ID: ${dto.userId} liked feed ID: ${dto.feedId}`,
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
                  (id) => id !== dto.userId,
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
            `User ID: ${dto.userId} unliked feed ID: ${dto.feedId}`,
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
        `Updated like count for feed ID: ${dto.feedId} to ${likeCount}`,
      );
      return updatedFeed;
    } catch (error) {
      this.logger.error(
        `Failed to process like for feed ID: ${dto.feedId} by user ID: ${dto.userId}`,
        error.stack,
      );
      throw new HttpException('Failed to process like', HttpStatus.BAD_REQUEST);
    }
  }

  //Saves or unsaves a feed image.

  async feedSave(photographerId: string, dto: FeedSaveDto) {
    try {
      this.logger.log(
        `Processing save for feed ID: ${dto.feedId} by user ID: ${dto.userId}`,
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
            `User ID: ${dto.userId} saved feed ID: ${dto.feedId}`,
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
                  (id) => id !== dto.userId,
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
            `User ID: ${dto.userId} unsaved feed ID: ${dto.feedId}`,
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
        `Updated save count for feed ID: ${dto.feedId} to ${saveCount}`,
      );
      return updatedFeed;
    } catch (error) {
      this.logger.error(
        `Failed to process save for feed ID: ${dto.feedId} by user ID: ${dto.userId}`,
        error.stack,
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
        error.stack,
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
        `Successfully fetched header for photographer with user ID: ${id}`,
      );
      return header;
    } catch (error) {
      this.logger.error(
        `Failed to fetch header for photographer with user ID: ${id}`,
        error.stack,
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
        `Successfully updated caption for feed ID: ${dto.feedId}`,
      );
      return updatedFeed;
    } catch (error) {
      this.logger.error(
        `Failed to update caption for feed ID: ${dto.feedId}`,
        error.stack,
      );
      throw new HttpException(
        'Failed to update caption',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ------- booking creation services ---------

  //Fetches the categories of bookings for a specific photographer and converts them to lowercase.

  async getBookingsCategory(id: string) {
    try {
      this.logger.log(
        `Fetching bookings categories for photographer with user ID: ${id}`,
      );

      const bookings = await this.prisma.photographer.findMany({
        where: {
          userId: id,
        },
        select: {
          category: true,
        },
      });

      if (bookings.length === 0) {
        this.logger.warn(
          `No bookings found for photographer with user ID: ${id}`,
        );
      }

      const lowercaseCategories = bookings.map((booking) => ({
        category: booking.category.map((category) => category.charAt(0) + category.slice(1).toLowerCase()),
      }));

      this.logger.log(
        `Successfully fetched and converted categories to lowercase for user ID: ${id}`,
      );
      return lowercaseCategories;
    } catch (error) {
      this.logger.error(
        `Failed to fetch bookings categories for user ID: ${id}`,
        error.stack,
      );
      throw new HttpException(
        'Failed to fetch bookings categories',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  //Fetches the booking packages for a specific photographer
   
  async getBookingsPackage(id: string) {
    try {
      this.logger.log(`Fetching booking packages for photographer with ID: ${id}`);

      const packages = await this.prisma.package.findMany({
        where: {
          photographerId: id,
        },
        select: {
          id: true,
          name: true,
        },
      });

      if (packages.length === 0) {
        this.logger.warn(`No booking packages found for photographer with ID: ${id}`);
      }

      this.logger.log(`Successfully fetched booking packages for photographer with ID: ${id}`);
      return packages;
    } catch (error) {
      this.logger.error(`Failed to fetch booking packages for photographer with ID: ${id}`, error.stack);
      throw new HttpException('Failed to fetch booking packages', HttpStatus.NOT_FOUND);
    }
  }

  //Creates a new booking for a client
  
  async clientBooking(dto: ClientBookingDto) {

    try {
      this.logger.log(`Creating booking for client ID: ${dto.clientId} and photographer ID: ${dto.photographerId}`);

      const newBooking = await this.prisma.booking.create({
        data: {
          client: {
            connect: {
              userId: dto.clientId,
            },
          },
          photographer: {
            connect: {
              userId: dto.photographerId,
            },
          },

          subject: dto.eventName,
          start: dto.start,
          end: dto.end,
          location: dto.eventLocation,
          category:
            PhotographerCategory[
              dto.category.toUpperCase() as keyof typeof PhotographerCategory
            ],
          package: {
            connect: {
              id: dto.packageId,
            },
          },
        },
      });

      this.logger.log(`Successfully created booking for client ID: ${dto.clientId} and photographer ID: ${dto.photographerId}`);
      return newBooking;
    } catch (error) {
      this.logger.error(`Failed to create booking for client ID: ${dto.clientId} and photographer ID: ${dto.photographerId}`, error.stack);
      throw new HttpException('Failed to create booking', HttpStatus.BAD_REQUEST);
    }
  }

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

  // ------- payment services ---------

  async getPayments(id: string) {
    return await this.prisma.payment.findMany({
      where: {
        photographerId: id,
      },
      include: {
        booking: {
          select: {
            id: true,
            category: true,
          },
        },
        client: {
          select: {
            name: true,
          },
        },
      },
    });
  }


  async getEarnings(id: string) {
    const earningsDtoData = new EarningsDto();

    const payments = await this.prisma.payment.findMany({
      where: {
        photographerId: id,
      },
      select: {
        amount: true,
        status: true,
      },
    });

    let paidTot = 0;
    let pendingTot = 0;

    payments.map((payment) => {
      if (payment.status === 'PAID') {
        paidTot += payment.amount;
      } else if (payment.status === 'PENDING') {
        pendingTot += payment.amount;
      }
    });

    earningsDtoData.fees = 0.1 * paidTot;
    earningsDtoData.totalAmount = paidTot - earningsDtoData.fees;
    earningsDtoData.pending = pendingTot;

    return earningsDtoData;
  }

 

}





