import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTestimonialDto } from './dto/testimonial.dto';
import { Package, TestimonialVisibility, PhotographerCategory } from '@prisma/client';
import { VisibilityDto } from './dto/visibility.dto';
import {
  Injectable,
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
import { ReportDto } from './dto/report.dto';
import { AlbumImagesDto, AlbumsDto, updateAlbumDto } from './dto/album.dto';
import { updatePackageDto } from './dto/updatePackage.dto';
import { createPackageDto } from './dto/createPackage.dto';
import { deletePackageDto } from './dto/deletePackage.dto';
import { NotifyService } from '../notification/notify.service';
import { CreateNotifyDto } from 'src/notification/dto/create-notify.dto';
import { ClientBookingDto } from './dto/clientBooking.dto';

@Injectable()
export class PhotographerService {

  constructor(private prisma: PrismaService, private NotifyService: NotifyService) { }

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
        userId: userId
      },
      include: {
        user: true,
      },
      data: {
        user: {
          update: {
            image: data.image
          }
        }
      }
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
          }
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
          }
        },
        name: dto.name,
        description: dto.description,
        coverPhotos: dto.coverPhotos,
        price: dto.price,
      },
    });
  }

  async getPackageDetails(photographerId: string) {
    return await this.prisma.package.findMany({
      where: {
        photographerId: photographerId,
      },
      include: {
        booking: false
      },
    });
  }

  async getPackageById(packageId: string) {
    return await this.prisma.package.findUnique({
      where: {
        id: packageId,
      }
    });
  }

  async deletePackageDetails(dto: deletePackageDto) {
    const photographer = await this.prisma.photographer.findUnique({
      where: {
        userId: dto.photographerId,
      }
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
      data
    });
  }

  // ------- featured section services ---------

  async getFeatured(userId: string) {
    return await this.prisma.photographer.findUnique({
      where: {
        userId: userId
      }
    });
  }

  async updateFeatured(id: string, data: Partial<Photographer>) {
    return await this.prisma.photographer.update({
      where: {
        userId: id
      },
      data
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

  async createReport(id: string, dto: ReportDto) {
    return await this.prisma.report.create({
      data: {
        subject: dto.subject,
        description: dto.description,
        user: {
          connect: {
            id: id,
          }
        }
      },
    });
  }

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
          accountBranchCode: dto.accountBranchCode ? dto.accountBranchCode : undefined,
        },
      });
    }
    return await this.prisma.bankDetails.findUnique({
      where: { photographerId: userId }
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
        photographer: {
          connect: {
            userId: dto.photographerId,
          },
        },
      },
      include: {
        images: true,
      }
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
      }
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

    const images = await Promise.all(dto.images.map((imageUrl) =>
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
    ));

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


  async feedLike(photographerId:string,dto: FeedLikeDto) {
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
      // Fetch the user name for the notification
      const userName = await this.prisma.user.findUnique({
        where: {
          id: dto.userId,
        },
        select: {
          userName: true,
        },
      })
      // Create the notification DTO data
      const createNotifyDtoData = new CreateNotifyDto();
      createNotifyDtoData.receiverId = photographerId;
      createNotifyDtoData.type = "liked";
      createNotifyDtoData.title =`${userName.userName} likes your photo`;
      await this.NotifyService.createNotification(createNotifyDtoData);   

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
        }
        )
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

  async feedSave(photographerId:string ,dto: FeedSaveDto) {
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

            // Fetch the user name for the notification
            const userName = await this.prisma.user.findUnique({
              where: {
                id: dto.userId,
              },
              select: {
                userName: true,
              },
            })
            // Create the notification DTO data
            const createNotifyDtoData = new CreateNotifyDto();
            createNotifyDtoData.receiverId = photographerId;
            createNotifyDtoData.type = "saved";
            createNotifyDtoData.title =`${userName.userName} saved your photo`;
            await this.NotifyService.createNotification(createNotifyDtoData);  

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
        }
          )
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
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    startDate.setDate(startDate.getDate() + 1);
    endDate.setDate(endDate.getDate() + 1);
    
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
        startdate: startDate.toISOString(),
        enddate: endDate.toISOString(),
        start: dto.startTime,
        end: dto.endTime,
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
}
