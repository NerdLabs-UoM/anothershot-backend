import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { PackagesService } from './packages.service';
import { Logger, HttpException, HttpStatus } from '@nestjs/common';
import { createPackageDto } from './dto/createPackage.dto';
import { updatePackageDto } from './dto/updatePackage.dto';
import { deletePackageDto } from './dto/deletePackage.dto';
import { Package } from '@prisma/client';

@Controller('api/photographer')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}
  private readonly logger = new Logger(PackagesController.name);

  // ------- package section controllers ---------

  @Post('packages/create')
  async createPackage(@Body() dto: createPackageDto) {
    try {
      this.logger.log(
        `Creating package for photographer ID: ${dto.photographerId}`
      );
      const createdPackage = await this.packagesService.createPackage(dto);
      this.logger.log(
        `Package created successfully for photographer ID: ${dto.photographerId}`
      );
      return createdPackage;
    } catch (error) {
      this.logger.error(
        `Error creating package for photographer ID: ${dto.photographerId}`,
        error.message
      );
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was a problem creating the package.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put('packages/edit')
  async updatePackageDetails(@Body() dto: updatePackageDto) {
    try {
      this.logger.log(
        `Updating package details for package ID: ${dto.packageId}`
      );
      const updatedPackage =
        await this.packagesService.updatePackageDetails(dto);
      this.logger.log(
        `Package details updated successfully for package ID: ${dto.packageId}`
      );
      return updatedPackage;
    } catch (error) {
      this.logger.error(
        `Error updating package details for package ID: ${dto.packageId}`,
        error.message
      );
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was a problem updating the package details.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('packages/:photographerId')
  async getPackageDetails(@Param('photographerId') photographerId: string) {
    try {
      this.logger.log(
        `Fetching package details for photographer ID: ${photographerId}`
      );
      const packages =
        await this.packagesService.getPackageDetails(photographerId);
      if (!packages || packages.length === 0) {
        this.logger.warn(
          `No packages found for photographer ID: ${photographerId}`
        );
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'No packages found for the given photographer ID.',
          },
          HttpStatus.NOT_FOUND
        );
      }
      this.logger.log(
        `Package details fetched successfully for photographer ID: ${photographerId}`
      );
      return packages;
    } catch (error) {
      this.logger.error(
        `Error fetching package details for photographer ID: ${photographerId}`,
        error.message
      );
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was a problem fetching the package details.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':packageId/package')
  async getPackageById(@Param('packageId') packageId: string) {
    try {
      this.logger.log(`Fetching package details for package ID: ${packageId}`);
      const packageDetails =
        await this.packagesService.getPackageById(packageId);
      if (!packageDetails) {
        this.logger.warn(`No package found for package ID: ${packageId}`);
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Package not found for the given package ID.',
          },
          HttpStatus.NOT_FOUND
        );
      }
      this.logger.log(
        `Package details fetched successfully for package ID: ${packageId}`
      );
      return packageDetails;
    } catch (error) {
      this.logger.error(
        `Error fetching package details for package ID: ${packageId}`,
        error.message
      );
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was a problem fetching the package details.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete('packages/delete')
  async deletePackage(@Body() dto: deletePackageDto) {
    try {
      this.logger.log(
        `Deleting package with ID: ${dto.packageId} for photographer ID: ${dto.photographerId}`
      );
      const deletedPackage =
        await this.packagesService.deletePackageDetails(dto);
      this.logger.log(
        `Package deleted successfully with ID: ${dto.packageId} for photographer ID: ${dto.photographerId}`
      );
      return deletedPackage;
    } catch (error) {
      this.logger.error(
        `Error deleting package with ID: ${dto.packageId} for photographer ID: ${dto.photographerId}`,
        error.message
      );
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was a problem deleting the package.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  @Put(':packageId/coverphotos')
  async saveCoverPhotos(
    @Param('packageId') packageId: string,
    @Body() coverPhotos: Partial<Package>
  ) {
    try {
      this.logger.log(`Saving cover photos for package ID: ${packageId}`);
      await this.packagesService.saveCoverPhotos(packageId, coverPhotos);
      this.logger.log(
        `Cover photos saved successfully for package ID: ${packageId}`
      );
    } catch (error) {
      this.logger.error(
        `Error saving cover photos for package ID: ${packageId}`,
        error.message
      );
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was a problem saving the cover photos.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
