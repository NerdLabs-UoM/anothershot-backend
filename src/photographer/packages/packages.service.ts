import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, NotFoundException, Logger, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { createPackageDto } from './dto/createPackage.dto';
import { updatePackageDto } from './dto/updatePackage.dto';
import { deletePackageDto } from './dto/deletePackage.dto';
import {Package} from '@prisma/client';

@Injectable()
export class PackagesService {
  private prisma: PrismaService;
  private readonly logger = new Logger(PackagesService.name);

  constructor(prisma: PrismaService) {
    this.prisma = prisma;
  }

 // ------- package section services ---------

 async createPackage(dto: createPackageDto) {
  try {
    this.logger.log(`Creating package for photographer ID: ${dto.photographerId}`);
    const newPackage = await this.prisma.package.create({
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
    this.logger.log(`Package created successfully for photographer ID: ${dto.photographerId}`);
    return newPackage;
  } catch (error) {
    this.logger.error(`Error creating package for photographer ID: ${dto.photographerId}`, error);
    throw error;
  }
}

async updatePackageDetails(dto: updatePackageDto) {
  try {
    this.logger.log(`Updating package details for package ID: ${dto.packageId}`);
    const photographer = await this.prisma.photographer.findUnique({
      where: {
        userId: dto.photographerId,
      },
      include: {
        user: true,
      },
    });

    if (!photographer) {
      this.logger.warn(`Photographer not found with ID: ${dto.photographerId}`);
      throw new NotFoundException('Photographer not found');
    }
    const updatedPackage = await this.prisma.package.update({
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
    this.logger.log(`Package updated successfully for package ID: ${dto.packageId}`);
    return updatedPackage;
  } catch (error) {
    this.logger.error(`Error updating package details for package ID: ${dto.packageId}`, error);
    throw error;
  }
}

async getPackageDetails(photographerId: string) {
  try {
    this.logger.log(`Fetching package details for photographer ID: ${photographerId}`);
    const packages = await this.prisma.package.findMany({
      where: {
        photographerId: photographerId,
      },
      include: {
        booking: false,
      },
    });
    if (!packages.length) {
      this.logger.warn(`No packages found for photographer ID: ${photographerId}`);
    }
    const cleanedPackages = packages.map(pkg => ({
      ...pkg,
      price: pkg.price.toString() !== '' ? parseFloat(pkg.price.toString()) : null,
    }));
    this.logger.log(`Package details fetched successfully for photographer ID: ${photographerId}`);
    return cleanedPackages;
  } catch (error) {
    this.logger.error(`Error fetching package details for photographer ID: ${photographerId}`, error);
    throw error;
  }
}

async getPackageById(packageId: string) {
  try {
    this.logger.log(`Fetching package with ID: ${packageId}`);
    const pkg = await this.prisma.package.findUnique({
      where: {
        id: packageId,
      },
    });
    if (!pkg) {
      this.logger.warn(`Package not found with ID: ${packageId}`);
      throw new Error(`Package with ID ${packageId} not found`);
    }
    this.logger.log(`Package fetched successfully with ID: ${packageId}`);
    return pkg;
  } catch (error) {
    this.logger.error(`Error fetching package with ID: ${packageId}`, error);
    throw error;
  }
}
async deletePackageDetails(dto: deletePackageDto) {
  try {
    this.logger.log(`Deleting package with ID: ${dto.packageId}`);
    const photographer = await this.prisma.photographer.findUnique({
      where: {
        userId: dto.photographerId,
      },
    });
    if (!photographer) {
      this.logger.warn(`Photographer not found with ID: ${dto.photographerId}`);
      throw new NotFoundException('Photographer not found');
    }
    const deletedPackage = await this.prisma.package.delete({
      where: {
        id: dto.packageId,
      },
    });
    this.logger.log(`Package deleted successfully with ID: ${dto.packageId}`);
    return deletedPackage;
  } catch (error) {
    this.logger.error(`Error deleting package with ID: ${dto.packageId}`, error);
    throw error;
  }
}

async saveCoverPhotos(packageId: string, data: Partial<Package>) {
  try {
    this.logger.log(`Saving cover photos for package ID: ${packageId}`);
    await this.prisma.package.update({
      where: { id: packageId },
      data,
    });
    this.logger.log(`Cover photos saved successfully for package ID: ${packageId}`);
  } catch (error) {
    this.logger.error(`Error saving cover photos for package ID: ${packageId}`, error);
    throw error;
  }
}
 
  
}
