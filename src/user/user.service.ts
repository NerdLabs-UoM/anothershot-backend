// UserService

import {
  ConflictException,
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, PasswordResetDto } from './dto/user.dto';
import { hash } from 'bcrypt';
import { Client, UserRole, Suspended, Admin, Account } from '@prisma/client';
import { SystemReportDto } from './dto/systemReport.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private prisma: PrismaService) {}

  // User Creation APIs

  async create(dto: CreateUserDto) {
    this.logger.log(`Creating user with email: ${dto.email}`);
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (user) {
        this.logger.error('User creation failed: Email already exists');
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
    } catch (error) {
      this.logger.error(`User creation failed: ${error.message}`, error.stack);
      throw new BadRequestException(error.message);
    }
  }

  // User Management APIs

  async activateUser(userId: string) {
    this.logger.log(`Activating user with ID: ${userId}`);
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        this.logger.error('User activation failed: User not found');
        throw new NotFoundException('User not found');
      }

      await this.prisma.user.update({
        where: { id: userId },
        data: { emailVerified: true },
      });
    } catch (error) {
      this.logger.error(
        `User activation failed: ${error.message}`,
        error.stack
      );
      throw new BadRequestException(error.message);
    }
  }

  async resetPassword(userId: string, password: PasswordResetDto) {
    this.logger.log(`Resetting password for user with ID: ${userId}`);
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        this.logger.error('Password reset failed: User not found');
        throw new NotFoundException('User not found');
      }

      const hashedPassword = await hash(password.password, 10);

      await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });
    } catch (error) {
      this.logger.error(`Password reset failed: ${error.message}`, error.stack);
      throw new BadRequestException(error.message);
    }
  }

  async linkAccount(userId: string, data: Account) {
    this.logger.log(`Linking account for user with ID: ${userId}`);
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: {
          accounts: {
            create: {
              ...data,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(
        `Account linking failed: ${error.message}`,
        error.stack
      );
      throw new BadRequestException(error.message);
    }
  }

  async findByEmail(email: string) {
    this.logger.log(`Finding user by email: ${email}`);
    try {
      return await this.prisma.user.findUnique({
        where: {
          email: email,
        },
        include: {
          accounts: true,
        },
      });
    } catch (error) {
      this.logger.error(
        `Finding user by email failed: ${error.message}`,
        error.stack
      );
      throw new BadRequestException(error.message);
    }
  }

  async findById(id: string) {
    this.logger.log(`Finding user by ID: ${id}`);
    try {
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
    } catch (error) {
      this.logger.error(
        `Finding user by ID failed: ${error.message}`,
        error.stack
      );
      throw new BadRequestException(error.message);
    }
  }

  async findUserById(id: string) {
    this.logger.log(`Finding user profile by ID: ${id}`);
    try {
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
                  socialMedia: true,
                },
              },
            },
          },
          chats: true,
        },
      });
    } catch (error) {
      this.logger.error(
        `Finding user profile by ID failed: ${error.message}`,
        error.stack
      );
      throw new BadRequestException(error.message);
    }
  }

  async deleteUserById(id: string) {
    this.logger.log(`Deleting user by ID: ${id}`);
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
      });

      if (!user) {
        this.logger.error('User deletion failed: User not found');
        throw new NotFoundException('User not found');
      }

      await this.prisma.user.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      this.logger.error(
        `Deleting user by ID failed: ${error.message}`,
        error.stack
      );
      throw new BadRequestException(error.message);
    }
  }

  async updateUserDetails(userId: string, data: UpdateUserDto) {
    this.logger.log(`Updating user details for ID: ${userId}`);
    try {
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
          await this.prisma.photographer.update({
            where: { userId: userId },
            data: {
              name: data.userName,
            },
          });
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
            name: data.userName,
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
    } catch (error) {
      this.logger.error(
        `Updating user details failed: ${error.message}`,
        error.stack
      );
      throw new BadRequestException(error.message);
    }
  }

  async updateClient(userId: string, data: Partial<Client>) {
    this.logger.log(`Updating client details for user ID: ${userId}`);
    try {
      await this.prisma.client.update({
        where: { userId: userId },
        data,
      });
    } catch (error) {
      this.logger.error(
        `Updating client details failed: ${error.message}`,
        error.stack
      );
      throw new BadRequestException(error.message);
    }
  }

  async updateAdmin(userId: string, data: Partial<Admin>) {
    this.logger.log(`Updating admin details for user ID: ${userId}`);
    try {
      await this.prisma.admin.update({
        where: { userId: userId },
        data,
      });
    } catch (error) {
      this.logger.error(
        `Updating admin details failed: ${error.message}`,
        error.stack
      );
      throw new BadRequestException(error.message);
    }
  }

  async updateSuspended(userId: string): Promise<void> {
    this.logger.log(`Suspending user with ID: ${userId}`);
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        this.logger.error(`User with ID: ${userId} not found`);
        throw new NotFoundException(`User with ID ${userId} not found.`);
      }

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          suspended: Suspended.SUSPENDED,
        },
      });
    } catch (error) {
      this.logger.error(
        `Suspending user failed: ${error.message}`,
        error.stack
      );
      throw new BadRequestException(error.message);
    }
  }

  async updateUnlock(userId: string): Promise<void> {
    this.logger.log(`Unlocking user with ID: ${userId}`);
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        this.logger.error(`User with ID: ${userId} not found`);
        throw new NotFoundException(`User with ID ${userId} not found.`);
      }

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          suspended: Suspended.NOT_SUSPENDED,
        },
      });
    } catch (error) {
      this.logger.error(`Unlocking user failed: ${error.message}`, error.stack);
      throw new BadRequestException(error.message);
    }
  }

  // System Report API

  async createSystemReport(id: string, dto: SystemReportDto): Promise<void> {
    this.logger.log(`Creating system report for user ID: ${id}`);
    try {
      await this.prisma.systemReport.create({
        data: {
          subject: dto.subject,
          description: dto.description,
          user: {
            connect: { id: id },
          },
        },
      });
    } catch (error) {
      this.logger.error(
        `Creating system report failed: ${error.message}`,
        error.stack
      );
      throw new BadRequestException(error.message);
    }
  }
}
