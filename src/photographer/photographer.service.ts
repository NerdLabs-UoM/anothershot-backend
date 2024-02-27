import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePhotographerDto } from './dto/photographer.dto';
import { Photographer, User } from '@prisma/client';

@Injectable()
export class PhotographerService {
  constructor(private prisma: PrismaService) {}

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

  async findall() {
    return await this.prisma.photographer.findMany();
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
            },data
        });
    }
}

