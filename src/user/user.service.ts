import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { hash } from 'bcrypt';
import {
  Client,
  Photographer,
  User,
  UserRole,
  Suspended,
  Admin,
} from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (user) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await hash(dto.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        userName: dto.userName,
        password: hashedPassword,
        userRole: dto.userRole,
      },
    });

    switch (newUser.userRole) {
      case UserRole.ADMIN:
        return await this.prisma.admin.create({
          data: {
            userId: newUser.id,
            name: newUser.userName,
          },
        });
      case UserRole.CLIENT:
        return await this.prisma.client.create({
          data: {
            userId: newUser.id,
            name: newUser.userName,
          },
        });
      case UserRole.PHOTOGRAPHER:
        return await this.prisma.photographer.create({
          data: {
            userId: newUser.id,
            name: newUser.userName,
          },
        });
      default:
        return newUser;
    }
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async findById(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        admin: true,
        client: true,
        photographer: true,
        chats: true,
      },
    });
  }

  async findUserById(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        admin: true,
        client: true,
        photographer: {
          include: {
            contactDetails: {
              include: {
                address: true,
                socialMedia: true
              }
            }
          }
        },
        chats: true,
      },
    });
  }

  async deleteUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({
      where: {
        id: id,
      },
    });
  }

  async updateUserDetails(userId: string, data: UpdateUserDto) {
    console.log(userId, data);
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (user && user.userRole === 'PHOTOGRAPHER') {
      const contactDetails = await this.prisma.contactDetails.findUnique({
        where: { photographerId: userId },
      });

      if (contactDetails) {
        await this.prisma.contactDetails.update({
          where: { photographerId: userId },
          data: {
            phoneNum1: data.phoneNum1,
            phoneNum2: data.phoneNum2,
            email: data.email,
            address: data.address
              ? {
                  upsert: {
                    where: { contactDetailsId: contactDetails.id },
                    create: { ...data.address },
                    update: { ...data.address },
                  },
                }
              : undefined,
            socialMedia: data.socialMedia
              ? {
                  upsert: {
                    where: { contactDetailsId: contactDetails.id },
                    create: { ...data.socialMedia },
                    update: { ...data.socialMedia },
                  },
                }
              : undefined,
          },
        });
        console.log(data.userName);
        await this.prisma.photographer.update({
          where: { userId: userId },
          data: {
            name: data.userName,
          },
        })
      } else {
        await this.prisma.contactDetails.create({
          data: {
            photographer: {
              connect: { userId: userId },
            },
            phoneNum1: data.phoneNum1,
            phoneNum2: data.phoneNum2,
            email: data.email,
            address: data.address
              ? { create: { ...data.address } }
              : undefined,
            socialMedia: data.socialMedia
              ? { create: { ...data.socialMedia } }
              : undefined,
          },
        });
      }
    } else {
      await this.prisma.photographer.update({
        where: { userId: userId },
        data: {
          name:data.userName,
        },
      });

    }
    return await this.prisma.contactDetails.findUnique({
      where: { photographerId: userId },
      include: {
        photographer: true,
        address: true,
        socialMedia: true,
      },
    });
  }

  async updateClient(userId: string, data: Partial<Client>) {
    await this.prisma.client.update({
      where: { userId: userId },data
    });
  }

  async updateAdmin(userId: string, data: Partial<Admin>) {
    await this.prisma.admin.update({
      where: { userId: userId },data
    });
  }


  async updateSuspended(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        suspended: Suspended.SUSPENDED,
      },
    });
  }

  async updateUnlock(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        suspended: Suspended.NOT_SUSPENDED,
      },
    });
  }
}
