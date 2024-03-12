import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTestimonialDto } from './dto/testimonial.dto';
import { TestimonialVisibility, Album } from '@prisma/client';
import { VisibilityDto } from './dto/visibility.dto';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdatePhotographerDto } from './dto/photographer.dto';
import { Photographer, User } from '@prisma/client';
import { contactDetailsDto } from './dto/contactDetails.dto';
import { bankDetailsDto } from './dto/bankDetails.dto';
import { ReportDto } from './dto/report.dto';
import { AlbumsDto } from './dto/album.dto';

@Injectable()
export class PhotographerService {
  constructor(private prisma: PrismaService) {}

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

  async findAll() {
    return await this.prisma.photographer.findMany({
      include: {
        user: true,
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

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async findById(id: string) {
    return await this.prisma.photographer.findUnique({
      where: {
        userId: id,
      },
      include: {
        user: true,
      },
    });
  }

  async updateUser(userId: string, data: Partial<Photographer>) {
    return await this.prisma.photographer.update({
      where: { userId: userId },
      data,
    });
  }

  async updateProfilePicture(
    userId: string,
    data: Partial<Photographer & { image: string }>,
  ) {
    return await this.prisma.photographer.update({
      where: {
        userId: userId, // Use the userId parameter passed to the method
      },
      include: {
        user: true,
      },
      data: {
        user: {
          // Since image is a property of the user object, you need to update it within the user object
          update: {
            image: data.image, // Set the image property to the value provided in the data parameter
          },
        },
      },
    });
  }

  async updateCoverPhoto(userId: string, data: Partial<Photographer>) {
    return await this.prisma.photographer.update({
      where: {
        userId: userId, // Use the userId parameter passed to the method
      },
      data,
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

  async updateBankDetails(dto: bankDetailsDto) {
    const excistingBankDetails = await this.prisma.bankDetails.findUnique({
      where: { photographerId: dto.userId },
    });

    if (excistingBankDetails) {
      await this.prisma.bankDetails.update({
        where: { photographerId: dto.userId },
        data: {
          bankName: dto.bankName,
          accountNumber: dto.accountNumber,
          accountName: dto.accountName,
          accountBranch: dto.accountBranch,
          accountBranchCode: dto.accountBranchCode
            ? dto.accountBranchCode
            : undefined,
        },
      });
    } else {
      await this.prisma.bankDetails.create({
        data: {
          photographer: {
            connect: {
              userId: dto.userId,
            },
          },
          bankName: dto.bankName,
          accountNumber: dto.accountNumber,
          accountName: dto.accountName,
          accountBranch: dto.accountBranch,
          accountBranchCode: dto.accountBranchCode? dto.accountBranchCode : undefined,
        },
      });
    }
    return await this.prisma.bankDetails.findUnique({
      where: { photographerId: dto.userId }
    });
  }

  async createReport(id:string,dto:Partial<ReportDto>){
    return await this.prisma.report.create({
      data: {
        photographerId: id,
        subject:dto.subject,
        description: dto.description, 
      },
      include: {
        photographer: true,
      },
    });
  }

  // async addAlbum(userId: string, data:Partial<Album>) {
  //   console.log("images ",data);
  //   return await this.prisma.album.update({
  //     where:{
  //       id:userId
  //     },
  //     data:{
  //       images:{
  //         create:{
  //           image:"image 1 url ",
  //           caption:"caption of image 1"
  //         }
  //       },
  //     }
  //   });
  // }

  // async createAlbum(dto: AlbumsDto) {
  //   return await this.prisma.album.create({
  //     data: {
  //       name: dto.name,
  //       description: dto.description,
  //       photographer: {
  //         connect: {
  //           userId: dto.photographerId,
  //         },
  //       },
  //       images: {
  //         create: dto.images.map((image) => {
  //           return {
  //             image: image,
  //           };
  //         }),
  //       }
  //     },
  //   });
  // }

  // async createAlbum(dto: { name: string; description: string; photographerId: string; images: string[] }) {
  //   return await this.prisma.album.create({
  //     data: {
  //       name: dto.name,
  //       description: dto.description,
  //       photographer: {
  //         connect: {
  //           userId: dto.photographerId,
  //         },
  //       },
  //       images: {
  //         create: dto.images.map((image) => {
  //           return {
  //             image: image,
  //             caption:image
  //           };
  //         }),
  //       }
  //     },
  //   });

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

  // async updateAlbums(userId:string,dto: AlbumsDto) {
  //   const existingAlbums = await this.prisma.album.findUnique({
  //     where: { id: dto.photographerId },
  //   });

  //   if (existingAlbums) {
  //     await this.prisma.album.update({
  //       where: { id: dto.photographerId },
  //       data: {
  //         name:dto.name,
  //         description:dto.description,
  //         images:dto.images{
  //           create:{
  //             image:dto.image,
  //             caption?:dto.caption
  //           }
  //         },
  //       }
  //     });
  //   }

}
