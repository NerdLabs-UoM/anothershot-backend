import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePhotographerDto } from './dto/photographer.dto';
import { Photographer, User } from '@prisma/client';
import { contactDetailsDto } from './dto/contactDetails.dto';

@Injectable()
export class PhotographerService {

  constructor(private prisma: PrismaService) { }
  
  async findAll() {
        return await this.prisma.photographer.findMany({
            include: {
                user: true
            }
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
            }
          },
          phoneNum1: dto.phoneNum1,
          phoneNum2: dto.phoneNum2,
          email: dto.email,
          address: dto.address
            ? { create: { ...dto.address } }
            : undefined,
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


  async updateProfilePicture(userId: string, data: Partial<Photographer & { image: string }>) {
    return await this.prisma.photographer.update({

      where: {
        userId: userId // Use the userId parameter passed to the method
      },
      include: {
        user: true,
      },
      data: {
        user: { // Since image is a property of the user object, you need to update it within the user object
          update: {
            image: data.image // Set the image property to the value provided in the data parameter
          }
        }
      }
    });
  }

  async updateCoverPhoto(userId: string, data: Partial<Photographer>) {
    return await this.prisma.photographer.update({
      where: {
        userId: userId // Use the userId parameter passed to the method
      }, data
    });
  }
}
