import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { Photographer, User } from '@prisma/client';

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
    data: Partial<Photographer & { image: string }>
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

  async updateHeroSection(
    userId: string,
    data: Partial<Photographer> & Partial<User>
  ) {
    if (data.image) {
      return await this.prisma.user.update({
        where: { id: userId },
        data: {
          image: data.image,
        },
      });
    } else {
      return await this.prisma.photographer.update({
        where: { userId: userId },
        data,
      });
    }
  }
}
