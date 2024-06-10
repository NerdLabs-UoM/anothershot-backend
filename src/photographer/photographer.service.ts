import { PrismaService } from 'src/prisma/prisma.service';
import {
  Package,
  PhotographerCategory,
} from '@prisma/client';
import {
  Injectable,
  NotFoundException,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Photographer, User } from '@prisma/client';
import { contactDetailsDto } from './dto/contactDetails.dto';
import { bankDetailsDto } from './dto/bankDetails.dto';
import { AlbumImagesDto, AlbumsDto, updateAlbumDto } from './dto/album.dto';
import { updatePackageDto } from './dto/updatePackage.dto';
import { createPackageDto } from './dto/createPackage.dto';
import { deletePackageDto } from './dto/deletePackage.dto';

import { createEventDto } from './dto/createEvent.dto';
import { updateEventDto } from './dto/updateEvent.dto';
import { deleteEventDto } from './dto/deleteEvent.dto';
import { NotifyService } from '../notification/notify.service';
import { EarningsDto } from './dto/earnings.dto';

@Injectable()
export class PhotographerService {
  private readonly logger = new Logger(PhotographerService.name);

  constructor(
    private prisma: PrismaService,
    private NotifyService: NotifyService,
  ) {}

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

  async updateHeroSection(userId:string, data:Partial<Photographer> & Partial<User>){

    if(data.image){
      return await this.prisma.user.update({
        where: { id: userId },
        data: {
          image: data.image,
        },
      });
    }
    else{
      return await this.prisma.photographer.update({
        where: { userId: userId },
        data,
      });
    }
  
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
        price: dto.price,
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
            category: true,
          },
        },
        client: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async getEarnings(id: string) {
    const earningsDtoData = new EarningsDto();

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

    payments.map((payment) => {
      if (payment.status === 'PAID') {
        paidTot += payment.amount;
      } else if (payment.status === 'PENDING') {
        pendingTot += payment.amount;
      }
    });

    earningsDtoData.fees = 0.1 * paidTot;
    earningsDtoData.totalAmount = paidTot - earningsDtoData.fees;
    earningsDtoData.pending = pendingTot;

    return earningsDtoData;
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
