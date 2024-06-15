import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, NotFoundException, Logger, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { contactDetailsDto } from './dto/contactDetails.dto';
import { Photographer } from '@prisma/client';


@Injectable()
export class ContactSectionService {

  private readonly logger = new Logger(ContactSectionService.name);

  constructor(
    private prisma: PrismaService,
    
  ) { }
  async updateContactDetails(dto: contactDetailsDto) {
    try {
      const tempUserId = dto.userId;
      this.logger.log(`Updating contact details for user ID: ${tempUserId}`);
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
        this.logger.log(`Contact details updated successfully for user ID: ${tempUserId}`);
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
            socialMedia: dto.socialMedia ? { create: { ...dto.socialMedia } } : undefined,
          },
        });
        this.logger.log(`Contact details created successfully for user ID: ${tempUserId}`);
      }
      const updatedContactDetails = await this.prisma.contactDetails.findUnique({
        where: { photographerId: dto.userId },
        include: {
          photographer: true,
          address: true,
          socialMedia: true,
        },
      });
      this.logger.log(`Contact details fetched successfully for user ID: ${tempUserId}`);
      return updatedContactDetails;
    } catch (error) {
      this.logger.error(`Error updating contact details for user ID: ${dto.userId}`, error);
      throw error;
    }
  }

  async getContactDetails(id: string) {
    try {
      this.logger.log(`Fetching contact details for photographer ID: ${id}`);
      const contactDetails = await this.prisma.contactDetails.findUnique({
        where: {
          photographerId: id,
        },
        include: {
          address: true,
          socialMedia: true,
        },
      });
      if (!contactDetails) {
        this.logger.warn(`Contact details not found for photographer ID: ${id}`);
        throw new Error(`Contact details not found for photographer ID: ${id}`);
      }
      this.logger.log(`Contact details fetched successfully for photographer ID: ${id}`);
      return contactDetails;
    } catch (error) {
      this.logger.error(`Error fetching contact details for photographer ID: ${id}`, error);
      throw error;
    }
  }
  
}
