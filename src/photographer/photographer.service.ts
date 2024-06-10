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

  // ------- contact section services ---------

  // async updateContactDetails(dto: contactDetailsDto) {
  //   try {
  //     const tempUserId = dto.userId;
  //     this.logger.log(`Updating contact details for user ID: ${tempUserId}`);
  //     const existingContactDetails = await this.prisma.contactDetails.findUnique({
  //       where: { photographerId: dto.userId },
  //     });
  //     if (existingContactDetails) {
  //       await this.prisma.contactDetails.update({
  //         where: { photographerId: dto.userId },
  //         data: {
  //           phoneNum1: dto.phoneNum1,
  //           phoneNum2: dto.phoneNum2,
  //           email: dto.email,
  //           address: dto.address
  //             ? {
  //                 upsert: {
  //                   where: { contactDetailsId: existingContactDetails.id },
  //                   create: { ...dto.address },
  //                   update: { ...dto.address },
  //                 },
  //               }
  //             : undefined,
  //           socialMedia: dto.socialMedia
  //             ? {
  //                 upsert: {
  //                   where: { contactDetailsId: existingContactDetails.id },
  //                   create: { ...dto.socialMedia },
  //                   update: { ...dto.socialMedia },
  //                 },
  //               }
  //             : undefined,
  //         },
  //       });
  //       this.logger.log(`Contact details updated successfully for user ID: ${tempUserId}`);
  //     } else {
  //       await this.prisma.contactDetails.create({
  //         data: {
  //           photographer: {
  //             connect: {
  //               userId: dto.userId,
  //             },
  //           },
  //           phoneNum1: dto.phoneNum1,
  //           phoneNum2: dto.phoneNum2,
  //           email: dto.email,
  //           address: dto.address ? { create: { ...dto.address } } : undefined,
  //           socialMedia: dto.socialMedia ? { create: { ...dto.socialMedia } } : undefined,
  //         },
  //       });
  //       this.logger.log(`Contact details created successfully for user ID: ${tempUserId}`);
  //     }
  //     const updatedContactDetails = await this.prisma.contactDetails.findUnique({
  //       where: { photographerId: dto.userId },
  //       include: {
  //         photographer: true,
  //         address: true,
  //         socialMedia: true,
  //       },
  //     });
  //     this.logger.log(`Contact details fetched successfully for user ID: ${tempUserId}`);
  //     return updatedContactDetails;
  //   } catch (error) {
  //     this.logger.error(`Error updating contact details for user ID: ${dto.userId}`, error);
  //     throw error;
  //   }
  // }

  // async getContactDetails(id: string) {
  //   try {
  //     this.logger.log(`Fetching contact details for photographer ID: ${id}`);
  //     const contactDetails = await this.prisma.contactDetails.findUnique({
  //       where: {
  //         photographerId: id,
  //       },
  //       include: {
  //         address: true,
  //         socialMedia: true,
  //       },
  //     });
  //     if (!contactDetails) {
  //       this.logger.warn(`Contact details not found for photographer ID: ${id}`);
  //       throw new Error(`Contact details not found for photographer ID: ${id}`);
  //     }
  //     this.logger.log(`Contact details fetched successfully for photographer ID: ${id}`);
  //     return contactDetails;
  //   } catch (error) {
  //     this.logger.error(`Error fetching contact details for photographer ID: ${id}`, error);
  //     throw error;
  //   }
  // }

  // // ------- package section services ---------

  // async createPackage(dto: createPackageDto) {
  //   try {
  //     this.logger.log(`Creating package for photographer ID: ${dto.photographerId}`);
  //     const newPackage = await this.prisma.package.create({
  //       data: {
  //         photographer: {
  //           connect: {
  //             userId: dto.photographerId,
  //           },
  //         },
  //         name: dto.name,
  //         description: dto.description,
  //         coverPhotos: dto.coverPhotos,
  //         price: dto.price,
  //       },
  //     });
  //     this.logger.log(`Package created successfully for photographer ID: ${dto.photographerId}`);
  //     return newPackage;
  //   } catch (error) {
  //     this.logger.error(`Error creating package for photographer ID: ${dto.photographerId}`, error);
  //     throw error;
  //   }
  // }

  // async updatePackageDetails(dto: updatePackageDto) {
  //   try {
  //     this.logger.log(`Updating package details for package ID: ${dto.packageId}`);
  //     const photographer = await this.prisma.photographer.findUnique({
  //       where: {
  //         userId: dto.photographerId,
  //       },
  //       include: {
  //         user: true,
  //       },
  //     });

  //     if (!photographer) {
  //       this.logger.warn(`Photographer not found with ID: ${dto.photographerId}`);
  //       throw new NotFoundException('Photographer not found');
  //     }
  //     const updatedPackage = await this.prisma.package.update({
  //       where: {
  //         id: dto.packageId,
  //       },
  //       data: {
  //         photographer: {
  //           connect: {
  //             userId: dto.photographerId,
  //           },
  //         },
  //         name: dto.name,
  //         description: dto.description,
  //         coverPhotos: dto.coverPhotos,
  //         price: dto.price,
  //       },
  //     });
  //     this.logger.log(`Package updated successfully for package ID: ${dto.packageId}`);
  //     return updatedPackage;
  //   } catch (error) {
  //     this.logger.error(`Error updating package details for package ID: ${dto.packageId}`, error);
  //     throw error;
  //   }
  // }

  // async getPackageDetails(photographerId: string) {
  //   try {
  //     this.logger.log(`Fetching package details for photographer ID: ${photographerId}`);
  //     const packages = await this.prisma.package.findMany({
  //       where: {
  //         photographerId: photographerId,
  //       },
  //       include: {
  //         booking: false,
  //       },
  //     });
  //     if (!packages.length) {
  //       this.logger.warn(`No packages found for photographer ID: ${photographerId}`);
  //     }
  //     const cleanedPackages = packages.map(pkg => ({
  //       ...pkg,
  //       price: pkg.price.toString() !== '' ? parseFloat(pkg.price.toString()) : null,
  //     }));
  //     this.logger.log(`Package details fetched successfully for photographer ID: ${photographerId}`);
  //     return cleanedPackages;
  //   } catch (error) {
  //     this.logger.error(`Error fetching package details for photographer ID: ${photographerId}`, error);
  //     throw error;
  //   }
  // }

  // async getPackageById(packageId: string) {
  //   try {
  //     this.logger.log(`Fetching package with ID: ${packageId}`);
  //     const pkg = await this.prisma.package.findUnique({
  //       where: {
  //         id: packageId,
  //       },
  //     });
  //     if (!pkg) {
  //       this.logger.warn(`Package not found with ID: ${packageId}`);
  //       throw new Error(`Package with ID ${packageId} not found`);
  //     }
  //     this.logger.log(`Package fetched successfully with ID: ${packageId}`);
  //     return pkg;
  //   } catch (error) {
  //     this.logger.error(`Error fetching package with ID: ${packageId}`, error);
  //     throw error;
  //   }
  // }
  // async deletePackageDetails(dto: deletePackageDto) {
  //   try {
  //     this.logger.log(`Deleting package with ID: ${dto.packageId}`);
  //     const photographer = await this.prisma.photographer.findUnique({
  //       where: {
  //         userId: dto.photographerId,
  //       },
  //     });
  //     if (!photographer) {
  //       this.logger.warn(`Photographer not found with ID: ${dto.photographerId}`);
  //       throw new NotFoundException('Photographer not found');
  //     }
  //     const deletedPackage = await this.prisma.package.delete({
  //       where: {
  //         id: dto.packageId,
  //       },
  //     });
  //     this.logger.log(`Package deleted successfully with ID: ${dto.packageId}`);
  //     return deletedPackage;
  //   } catch (error) {
  //     this.logger.error(`Error deleting package with ID: ${dto.packageId}`, error);
  //     throw error;
  //   }
  // }

  // async saveCoverPhotos(packageId: string, data: Partial<Package>) {
  //   try {
  //     this.logger.log(`Saving cover photos for package ID: ${packageId}`);
  //     await this.prisma.package.update({
  //       where: { id: packageId },
  //       data,
  //     });
  //     this.logger.log(`Cover photos saved successfully for package ID: ${packageId}`);
  //   } catch (error) {
  //     this.logger.error(`Error saving cover photos for package ID: ${packageId}`, error);
  //     throw error;
  //   }
  // }

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
        price: dto.price
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
    return await this.prisma.payment.findMany({
      where: {
        photographerId: id,
      },
      include: {
        booking: {
          select: {
            id: true,
            category: true
          }
        },
        client: {
          select: {
            name: true
          }
        }
      },
    })
  }


  async getEarnings(id: string) {
    const earningsDtoData = new EarningsDto();

    const payments = await this.prisma.payment.findMany({
      where: {
        photographerId: id,
      },
      select: {
        amount: true,
        status: true
      }
    })

    let paidTot = 0;
    let pendingTot = 0;

    payments.map((payment) => {
      if (payment.status === 'PAID') {
        paidTot += payment.amount;
      } else if (payment.status === 'PENDING') {
        pendingTot += payment.amount;
      }
    })

    earningsDtoData.fees = 0.1 * paidTot;
    earningsDtoData.totalAmount = paidTot - earningsDtoData.fees;
    earningsDtoData.pending = pendingTot;

    return earningsDtoData;
  }

  //------- booking services ---------

  async getBookings(photographerId: string) {
    try {
      this.logger.log(`Fetching bookings for photographer ID: ${photographerId}`);
      const bookings = await this.prisma.booking.findMany({
        where: {
          photographerId: photographerId
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
        }
      });
      this.logger.log(`Bookings fetched successfully for photographer ID: ${photographerId}`);
      return bookings;
    } catch (error) {
      this.logger.error(`Error fetching bookings for photographer ID: ${photographerId}`, error.message);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was a problem fetching the bookings.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  //------- event services ---------

  async createEvents(dto: createEventDto) {
    try {
      this.logger.log(`Creating event with booking ID: ${dto.bookingId}`);
      const booking = await this.prisma.booking.findUnique({ where: { id: dto.bookingId } });
      if (!booking) {
        this.logger.warn(`Booking not found with ID: ${dto.bookingId}`);
        throw new Error('Booking not found');
      }
      const newEvent = await this.prisma.event.create({
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
      this.logger.log(`Event created successfully with booking ID: ${dto.bookingId}`);
      return newEvent;
    } catch (error) {
      this.logger.error(`Error creating event with booking ID: ${dto.bookingId}`, error);
      throw error;
    }
  }


  async getEvents(id: string) {
    try {
      this.logger.log(`Fetching events for photographer ID: ${id}`);
      const events = await this.prisma.event.findMany({
        where: {
          Booking: {
            photographerId: id,
          },
        },
      });
      this.logger.log(`Events fetched successfully for photographer ID: ${id}`);
      return events;
    } catch (error) {
      this.logger.error(`Error fetching events for photographer ID: ${id}`, error);
      throw error;
    }
  }

  async getEventById(eventId: string) {
    try {
      this.logger.log(`Fetching event with ID: ${eventId}`);
      const event = await this.prisma.package.findUnique({
        where: {
          id: eventId,
        },
      });
      if (!event) {
        this.logger.warn(`Event not found with ID: ${eventId}`);
        throw new Error(`Event with ID ${eventId} not found`);
      }
      this.logger.log(`Event fetched successfully with ID: ${eventId}`);
      return event;
    } catch (error) {
      this.logger.error(`Error fetching event with ID: ${eventId}`, error);
      throw error;
    }
  }

  async updateEvents(dto: updateEventDto) {
    try {
      this.logger.log(`Updating event with ID: ${dto.eventId}`);
      const updatedEvent = await this.prisma.event.update({
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
      this.logger.log(`Event updated successfully with ID: ${dto.eventId}`);
      return updatedEvent;
    } catch (error) {
      this.logger.error(`Error updating event with ID: ${dto.eventId}`, error);
      throw error;
    }
  }

  async deleteEvents(dto: deleteEventDto) {
    try {
      this.logger.log(`Deleting event with ID: ${dto.id}`);
      const deletedEvent = await this.prisma.event.delete({
        where: {
          id: dto.id,
        },
      });
      this.logger.log(`Event deleted successfully with ID: ${dto.id}`);
      return deletedEvent;
    } catch (error) {
      this.logger.error(`Error deleting event with ID: ${dto.id}`, error);
      throw error;
    }
  }
}




