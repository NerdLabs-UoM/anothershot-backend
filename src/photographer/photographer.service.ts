import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTestimonialDto } from './dto/testimonial.dto';
import {
  Package,
  TestimonialVisibility,
  PhotographerCategory,
} from '@prisma/client';
import { VisibilityDto } from './dto/visibility.dto';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Photographer, User } from '@prisma/client';
import { contactDetailsDto } from './dto/contactDetails.dto';
import { FeedDto } from './dto/feed.dto';
import { FeedLikeDto } from './dto/feedLike.dto';
import { FeedSaveDto } from './dto/feedSave.dto';
import { DeleteFeedDto } from './dto/deleteFeed.dto';
import { CaptionDto } from './dto/caption.dto';
import { bankDetailsDto } from './dto/bankDetails.dto';
import { AlbumImagesDto, AlbumsDto, UpdateAlbumCoverDto, updateAlbumDto } from './dto/album.dto';
import { updatePackageDto } from './dto/updatePackage.dto';
import { createPackageDto } from './dto/createPackage.dto';
import { deletePackageDto } from './dto/deletePackage.dto';

import { createEventDto } from './dto/createEvent.dto';
import { updateEventDto } from './dto/updateEvent.dto';
import { deleteEventDto } from './dto/deleteEvent.dto';
import { NotifyService } from '../notification/notify.service';
import { CreateNotifyDto } from 'src/notification/dto/create-notify.dto';
import { ClientBookingDto } from './dto/clientBooking.dto';
import { EarningsDto } from './dto/earnings.dto';

@Injectable()
export class PhotographerService {
  private readonly logger = new Logger(PhotographerService.name);

  constructor(private prisma: PrismaService) {}

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

  // ------- contact section services ---------

  async updateContactDetails(dto: contactDetailsDto) {
    const tempUserId = dto.userId;
    const existingContactDetails = await this.prisma.contactDetails.findUnique({
      where: { photographerId: dto.userId },
    });

    if (existingContactDetails) {
      await this.prisma.contactDetails.update({
        where: { photographerId: dto.userId },
        data: {
          phoneNum1: dto.phoneNum1,
          phoneNum2: dto.phoneNum2,
          email: dto.email,
          address: dto.address
            ? {
                upsert: {
                  where: { contactDetailsId: existingContactDetails.id },
                  create: { ...dto.address },
                  update: { ...dto.address },
                },
              }
            : undefined,
          socialMedia: dto.socialMedia
            ? {
                upsert: {
                  where: { contactDetailsId: existingContactDetails.id },
                  create: { ...dto.socialMedia },
                  update: { ...dto.socialMedia },
                },
              }
            : undefined,
        },
      });
    } else {
      await this.prisma.contactDetails.create({
        data: {
          photographer: {
            connect: {
              userId: dto.userId,
            },
          },
          phoneNum1: dto.phoneNum1,
          phoneNum2: dto.phoneNum2,
          email: dto.email,
          address: dto.address ? { create: { ...dto.address } } : undefined,
          socialMedia: dto.socialMedia
            ? { create: { ...dto.socialMedia } }
            : undefined,
        },
      });
    }

    return await this.prisma.contactDetails.findUnique({
      where: { photographerId: dto.userId },
      include: {
        photographer: true,
        address: true,
        socialMedia: true,
      },
    });
  }

  async getContactDetails(id: string) {
    return this.prisma.contactDetails.findUnique({
      where: {
        photographerId: id,
      },
      include: {
        address: true,
        socialMedia: true,
      },
    });
  }

  // ------- package section services ---------

  async createPackage(dto: createPackageDto) {
    return await this.prisma.package.create({
      data: {
        photographer: {
          connect: {
            userId: dto.photographerId,
          },
        },
        name: dto.name,
        description: dto.description,
        coverPhotos: dto.coverPhotos,
        price: dto.price,
      },
    });
  }

  async updatePackageDetails(dto: updatePackageDto) {
    const photographer = await this.prisma.photographer.findUnique({
      where: {
        userId: dto.photographerId,
      },
      include: {
        user: true,
      },
    });
    if (!photographer) {
      throw new NotFoundException('Photographer not found');
    }
    return await this.prisma.package.update({
      where: {
        id: dto.packageId,
      },
      data: {
        photographer: {
          connect: {
            userId: dto.photographerId,
          },
        },
        name: dto.name,
        description: dto.description,
        coverPhotos: dto.coverPhotos,
        price: dto.price,
      },
    });
  }

  async getPackageDetails(photographerId: string) {
    const packages = await this.prisma.package.findMany({
      where: {
        photographerId: photographerId,
      },
      include: {
        booking: false,
      },
    });
    const cleanedPackages = packages.map((pkg) => ({
      ...pkg,
      price:
        pkg.price.toString() !== '' ? parseFloat(pkg.price.toString()) : null,
    }));
    return cleanedPackages;
  }

  async getPackageById(packageId: string) {
    return await this.prisma.package.findUnique({
      where: {
        id: packageId,
      },
    });
  }

  async deletePackageDetails(dto: deletePackageDto) {
    const photographer = await this.prisma.photographer.findUnique({
      where: {
        userId: dto.photographerId,
      },
    });

    if (!photographer) {
      throw new NotFoundException('Photographer not found');
    }

    return await this.prisma.package.delete({
      where: {
        id: dto.packageId,
      },
    });
  }

  async saveCoverPhotos(packageId: string, data: Partial<Package>) {
    await this.prisma.package.update({
      where: { id: packageId },
      data,
    });
  }

  // ------- featured section services ---------

  async getFeatured(userId: string) {
    return await this.prisma.photographer.findUnique({
      where: {
        userId: userId,
      },
    });
  }

  async updateFeatured(id: string, data: Partial<Photographer>) {
    return await this.prisma.photographer.update({
      where: {
        userId: id,
      },
      data,
    });
  }

  // ------- testmonial services ---------

  async createTestimonial(dto: CreateTestimonialDto) {
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
  }

  async getTestimonials(photographerId: string) {
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
  }

  async updateTestimonial(id: string, dto: CreateTestimonialDto) {
    return await this.prisma.testimonial.update({
      where: {
        id: id,
      },
      data: {
        ...dto,
      },
    });
  }

  async updateTestimonialVisibility(dto: VisibilityDto) {
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
  }

  // ------- settings services ---------
  async getBankDetails(photographerId: string) {
    this.logger.log(
      `Attempting to fetch bank details for photographer with ID: ${photographerId}`,
    );

    try {
      // Fetching the bank details associated with the specified photographer ID
      const bankDetails = await this.prisma.bankDetails.findUnique({
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

      // Handling the case where bank details are not found
      this.logger.log(
        `Successfully fetched category for photographer with ID: ${photographerId}`,
      );
      return bankDetails;
    } catch (error) {
      this.logger.error(
        `Failed to fetch category for photographer with ID: ${photographerId}`,
        error.stack,
      );
      if (error instanceof NotFoundException) {
        throw error; // Re-throw if it's a not found exception.
      }
      throw new HttpException(
        'Error fetching category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
    this.logger.log('Attempting to fetch all photographer categories');

    try {
      // Fetching the predefined categories from the constants
      const categories = PhotographerCategory;

      this.logger.log('Successfully fetched all photographer categories');
      return categories;
    } catch (error) {
      this.logger.error('Failed to fetch photographer categories', error.stack);

      // Throwing an HTTP exception with internal server error status
      throw new HttpException(
        'Error fetching categories',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCategoryById(id: string) {
    this.logger.log(
      `Attempting to fetch category for photographer with ID: ${id}`,
    );

    try {
      const category = await this.prisma.photographer.findUnique({
        where: {
          userId: id,
        },
        select: {
          category: true,
        },
      });
      
      this.logger.log(
        `Successfully fetched category for photographer with ID: ${id}`,
      );
      return category;
    } catch (error) {
      this.logger.error(
        `Failed to fetch category for photographer with ID: ${id}`,
        error.stack,
      );
      if (error instanceof NotFoundException) {
        throw error; // Re-throw if it's a not found exception.
      }
      throw new HttpException(
        'Error fetching category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateCategory(userId: string, data: Partial<Photographer>) {
    this.logger.log(
      `Attempting to update category for photographer with ID: ${userId}`,
    );

    try {
      const updatedPhotographer = await this.prisma.photographer.update({
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

      this.logger.log(
        `Successfully updated category for photographer with ID: ${userId}`,
      );
      return updatedPhotographer;
    } catch (error) {
      this.logger.error(
        `Failed to update category for photographer with ID: ${userId}`,
        error.stack,
      );

      // Handling case where the photographer is not found
      if (error.code === 'P2025') {
        // P2025 is Prisma's code for a record not found error
        throw new NotFoundException(
          `Photographer with ID: ${userId} not found`,
        );
      }

      // General error handling
      throw new HttpException(
        'Error updating category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ------- album services ---------

  async createAlbum(dto: AlbumsDto) {
    this.logger.log(
      `Attempting to create a new album for photographer with ID: ${dto.photographerId}`,
    );

    try {
      // Creating a new album in the database with the provided details
      const newAlbum = await this.prisma.album.create({
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
          images: true, // Includes related images in the response
        },
      });

      this.logger.log(
        `Successfully created album '${dto.name}' for photographer with ID: ${dto.photographerId}`,
      );
      return newAlbum;
    } catch (error) {
      this.logger.error(
        `Failed to create album '${dto.name}' for photographer with ID: ${dto.photographerId}`,
        error.stack,
      );

      // Throwing a generic HTTP exception with internal server error status
      throw new HttpException(
        'Error creating album',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async editAlbum(dto: updateAlbumDto) {
    try {
      // Updating the album in the database with the provided details
      const updatedAlbum = await this.prisma.album.update({
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

      this.logger.log(`Successfully updated album with ID: ${dto.albumId}`);
      return updatedAlbum;
    } catch (error) {
      this.logger.error(
        `Failed to update album with ID: ${dto.albumId}`,
        error.stack,
      );

      // Throwing a generic HTTP exception with internal server error status
      throw new HttpException(
        'Error updating album',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAlbums(id: string) {
    this.logger.log(
      `Attempting to fetch all albums for photographer with ID: ${id}`,
    );

    try {
      // Fetching all albums for the specified photographer ID, including associated images
      const albums = await this.prisma.album.findMany({
        where: {
          photographerId: id,
        },
        include: {
          images: true, // Includes related images in the response
        },
      });

      if (albums.length === 0) {
        this.logger.warn(`No albums found for photographer with ID: ${id}`);
        // Optionally: You can return an empty array or a specific message if no albums are found
        return [];
      }

      this.logger.log(
        `Successfully fetched ${albums.length} albums for photographer with ID: ${id}`,
      );
      return albums;
    } catch (error) {
      this.logger.error(
        `Failed to fetch albums for photographer with ID: ${id}`,
        error.stack,
      );

      // Throwing a generic HTTP exception with internal server error status
      throw new HttpException(
        'Error fetching albums',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAlbum(id: string) {
    this.logger.log(`Attempting to fetch album with ID: ${id}`);

    try {
      // Fetching the album from the database by its ID
      const album = await this.prisma.album.findMany({
        where: {
          id: id,
        },
      });

      if (album.length === 0) {
        this.logger.warn(`No album found with ID: ${id}`);
        // Throwing a 404 exception if no album is found
        throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
      }

      this.logger.log(`Successfully fetched album with ID: ${id}`);
      return album;
    } catch (error) {
      this.logger.error(`Failed to fetch album with ID: ${id}`, error.stack);

      // Throwing a generic HTTP exception with internal server error status
      throw new HttpException(
        'Error fetching album',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getImages(id: string) {
    this.logger.log(`Attempting to fetch images for album with ID: ${id}`);

    try {
      // Fetching all images associated with the specified album ID
      const images = await this.prisma.albumImage.findMany({
        where: {
          albumId: id,
        },
      });

      if (images.length === 0) {
        this.logger.warn(`No images found for album with ID: ${id}`);
      } else {
        this.logger.log(
          `Successfully fetched ${images.length} images for album with ID: ${id}`,
        );
      }

      return images;
    } catch (error) {
      this.logger.error(
        `Failed to fetch images for album with ID: ${id}`,
        error.stack,
      );
      // Throwing a generic HTTP exception with internal server error status
      throw new HttpException(
        'Error fetching images',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteAlbum(id: string) {
    this.logger.log(`Attempting to delete album with ID: ${id}`);

    try {
      // Deleting the album with the specified ID
      const deletedAlbum = await this.prisma.album.delete({
        where: {
          id: id,
        },
      });

      this.logger.log(`Successfully deleted album with ID: ${id}`);
      return deletedAlbum;
    } catch (error) {
      this.logger.error(`Failed to delete album with ID: ${id}`, error.stack);

      // Throwing a generic HTTP exception with internal server error status
      throw new HttpException(
        'Error deleting album',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addImages(dto: AlbumImagesDto) {
    this.logger.log(
      `Attempting to add images to album with ID: ${dto.albumId}`,
    );

    try {
      // Checking if the album exists
      const album = await this.prisma.album.findUnique({
        where: {
          id: dto.albumId,
        },
      });

      if (!album) {
        this.logger.warn(`Album not found with ID: ${dto.albumId}`);
        throw new NotFoundException('Album not found');
      }

      // Adding the images to the album
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

      this.logger.log(
        `Successfully added ${dto.images.length} images to album with ID: ${dto.albumId}`,
      );
      return images;
    } catch (error) {
      this.logger.error(
        `Failed to add images to album with ID: ${dto.albumId}`,
        error.stack,
      );

      // Throwing a generic HTTP exception with internal server error status
      throw new HttpException(
        'Error adding images to album',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteImage(id: string) {
    this.logger.log(`Attempting to delete image with ID: ${id}`);

    try {
      // Deleting the image with the specified ID
      const deletedImage = await this.prisma.albumImage.delete({
        where: {
          id: id,
        },
      });

      this.logger.log(`Successfully deleted image with ID: ${id}`);
      return deletedImage;
    } catch (error) {
      this.logger.error(`Failed to delete image with ID: ${id}`, error.stack);

      // Throwing a generic HTTP exception with internal server error status
      throw new HttpException(
        'Error deleting image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateAlbumCover(dto:UpdateAlbumCoverDto){
    this.logger.log(`Attempting to update cover image for album ID: ${dto.albumId}`);

    try {
      // Check if the album exists
      const album = await this.prisma.album.findUnique({
        where: { id: dto.albumId },
      });

      if (!album) {
        this.logger.warn(`Album with ID ${dto.albumId} not found`);
        throw new NotFoundException(`Album with ID ${dto.albumId} not found`);
      }

      // Update the album's cover image
      const updatedAlbum = await this.prisma.album.update({
        where: { id: dto.albumId },
        data: { coverImage: dto.coverImage },
      });

      this.logger.log(`Cover image updated successfully for album ID: ${dto.albumId}`);
      return updatedAlbum;
    } catch (error) {
      this.logger.error(`Error updating cover image for album ID: ${dto.albumId}`, error.stack);
      throw error; // Re-throw the error to be handled by the controller
    }
  }

  // ------- feed services ---------

  async getFeed(id: string) {
    return await this.prisma.feedImage.findMany({
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
  }

  async createFeedComponent(dto: FeedDto) {
    return await this.prisma.feedImage.create({
      data: {
        imageUrl: dto.image,
        photographer: {
          connect: {
            userId: dto.photographerId,
          },
        },
      },
    });
  }

  async feedLike(photographerId: string, dto: FeedLikeDto) {
    const existingLike = await this.prisma.feedImage.findFirst({
      where: {
        id: dto.feedId,
        likedUserIds: {
          has: dto.userId,
        },
      },
    });
    const feed = await this.prisma.feedImage.findUnique({
      where: {
        id: dto.feedId,
      },
      select: {
        id: true,
        likeCount: true,
      },
    });
    let likeCount = feed.likeCount;

    if (dto.like) {
      if (!existingLike) {
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
      }
    } else {
      if (existingLike) {
        await this.prisma.feedImage.update({
          where: {
            id: dto.feedId,
          },
          data: {
            likedUserIds: {
              set: existingLike.likedUserIds.filter((id) => id !== dto.userId),
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
      }
    }
    return await this.prisma.feedImage.update({
      where: {
        id: dto.feedId,
      },
      data: {
        likeCount: likeCount,
      },
    });
  }

  async feedSave(photographerId: string, dto: FeedSaveDto) {
    const existingSave = await this.prisma.feedImage.findFirst({
      where: {
        id: dto.feedId,
        savedUserIds: {
          has: dto.userId,
        },
      },
    });

    const feed = await this.prisma.feedImage.findUnique({
      where: {
        id: dto.feedId,
      },
      select: {
        id: true,
        saveCount: true,
      },
    });
    let saveCount = feed.saveCount;

    if (dto.save) {
      if (!existingSave) {
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
      }
    } else {
      if (existingSave) {
        await this.prisma.feedImage.update({
          where: {
            id: existingSave.id,
          },
          data: {
            savedUserIds: {
              set: existingSave.savedUserIds.filter((id) => id !== dto.userId),
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
      }
    }
    return await this.prisma.feedImage.update({
      where: {
        id: dto.feedId,
      },
      data: {
        saveCount: saveCount,
      },
    });
  }

  async deleteFeed(dto: DeleteFeedDto) {
    return await this.prisma.feedImage.delete({
      where: {
        id: dto.feedId,
      },
    });
  }

  async getFeedHeader(id: string) {
    return await this.prisma.photographer.findUnique({
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
  }

  async updateCaption(dto: CaptionDto) {
    return await this.prisma.feedImage.update({
      where: {
        id: dto.feedId,
      },
      data: {
        caption: dto.caption,
      },
    });
  }

  async getBookingsCategory(id: string) {
    const bookings = await this.prisma.photographer.findMany({
      where: {
        userId: id,
      },
      select: {
        category: true,
      },
    });
    const lowercaseCategories = bookings.map((booking) => ({
      category: booking.category.map((category) => category.toLowerCase()),
    }));

    return lowercaseCategories;
  }

  async getBookingsPackage(id: string) {
    return await this.prisma.package.findMany({
      where: {
        photographerId: id,
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  async clientBooking(dto: ClientBookingDto) {
    return await this.prisma.booking.create({
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
  }

  async getLikedImages(id: string) {
    return await this.prisma.user.findMany({
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
  }

  async getSavedImages(id: string) {
    return await this.prisma.user.findMany({
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
  }

  // ------- payment services ---------

  async getPayments(id: string) {
    this.logger.log(`Fetching payments for photographer with ID: ${id}`);
    try {
      const payments = await this.prisma.payment.findMany({
        where: {
          photographerId: id,
        },
        include: {
          client: {
            select: {
              name: true,
            },
          },
        },
      });
      this.logger.log(
        `Successfully fetched payments for photographer with ID: ${id}`,
      );
      return payments;
    } catch (error) {
      this.logger.error(
        `Failed to fetch payments for photographer with ID: ${id}`,
        error.stack,
      );
      throw new Error('Error fetching payments');
    }
  }

  async getEarnings(id: string) {
    this.logger.log(`Calculating earnings for photographer with ID: ${id}`);
    try {
      // Fetch payments for the given photographer
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

      // Calculate total paid and pending amounts
      payments.forEach((payment) => {
        if (payment.status === 'PAID') {
          paidTot += payment.amount;
        } else if (payment.status === 'PENDING') {
          pendingTot += payment.amount;
        }
      });

      // Create the earnings DTO
      const earningsDtoData = new EarningsDto();
      earningsDtoData.fees = 0.1 * paidTot; // 10% fees
      earningsDtoData.totalAmount = paidTot - earningsDtoData.fees; // Net earnings after fees
      earningsDtoData.pending = pendingTot; // Total pending payments

      this.logger.log(
        `Successfully calculated earnings for photographer with ID: ${id}`,
      );
      return earningsDtoData;
    } catch (error) {
      this.logger.error(
        `Failed to calculate earnings for photographer with ID: ${id}`,
        error.stack,
      );
      throw new Error('Error calculating earnings');
    }
  }

  //------- booking services ---------

  async getBookings(photographerId: string) {
    return await this.prisma.booking.findMany({
      where: {
        photographerId: photographerId,
      },
      select: {
        id: true,
        subject: true,
        start: true,
        status: true,
        location: true,
        category: true,
        client: {
          select: {
            name: true,
            id: true,
          },
        },
        photographer: {
          select: {
            name: true,
          },
        },
        offer: {
          select: {
            price: true,
          },
        },
        package: {
          select: {
            name: true,
            price: true,
          },
        },
      },
    });
  }

  //------- event services ---------

  async createEvents(dto: createEventDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
    });
    if (!booking) {
      throw new Error('Booking not found');
    }
    return await this.prisma.event.create({
      data: {
        title: dto.title,
        Booking: {
          connect: {
            id: dto.bookingId,
          },
        },
        description: dto.description,
        start: dto.start,
        end: dto.end,
        allDay: dto.allDay,
      },
    });
  }

  async getEvents(id: string) {
    return await this.prisma.event.findMany({
      where: {
        Booking: {
          photographerId: id,
        },
      },
    });
  }

  async getEventById(eventId: string) {
    return await this.prisma.package.findUnique({
      where: {
        id: eventId,
      },
    });
  }

  async updateEvents(dto: updateEventDto) {
    return await this.prisma.event.update({
      where: {
        id: dto.eventId,
      },
      data: {
        title: dto.title,
        description: dto.description,
        bookingId: dto.bookingId,
        start: dto.start,
        end: dto.end,
        allDay: dto.allDay,
      },
    });
  }

  async deleteEvents(dto: deleteEventDto) {
    return await this.prisma.event.delete({
      where: {
        id: dto.id,
      },
    });
  }
}
