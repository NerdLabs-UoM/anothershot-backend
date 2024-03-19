import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Param,
    Put,
    Request,
    Patch,
    Delete,
} from '@nestjs/common';
import { CreateTestimonialDto } from './dto/testimonial.dto';
import { VisibilityDto } from './dto/visibility.dto';
import { PhotographerService } from './photographer.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { UpdatePhotographerDto } from './dto/photographer.dto';
import { Package, Photographer, User } from '@prisma/client';
import { contactDetailsDto } from './dto/contactDetails.dto';
import { createPackageDto } from './dto/createPackage.dto';
import { updatePackageDto } from './dto/updatePackage.dto';
import { deletePackageDto } from './dto/deletePackage.dto';

@Controller('api/photographer')
export class PhotographerController {
    constructor(private photographerService: PhotographerService) { }

    @Post(':id/profile/testimonial')
    async createTestimonial(@Body() dto: CreateTestimonialDto) {
        return await this.photographerService.createTestimonial(dto);
    }

    @Get(':id/profile/testimonials')
    async getTestimonials(@Param('id') photographerId: string) {
        return await this.photographerService.getTestimonials(photographerId);
    }

    //@UseGuards(JwtGuard)
    @Patch(':id/profile/testimonials/visibility')
    async updateTestimonialVisibility(
        @Body() dto: VisibilityDto,
    ) {
        try {
            await this.photographerService.updateTestimonialVisibility(
                dto
            );
            return { message: 'Testimonials updated successfully' };
        } catch (error) {
            throw new HttpException('Failed to update testimonials', HttpStatus.BAD_REQUEST);
        }
    }

    @Get('get/all')
    async getAllPhotographers() {
        return await this.photographerService.findAll();
    }

    @Get(':id')
    async getUser(@Param('id') id: string) {
        return await this.photographerService.findById(id);
    }

    @Put(':id/profile-picture')
    async updateProfilePicture(
        @Param('id') id: string,
        @Body() data: Partial<Photographer>,
    ) {
        return await this.photographerService.updateProfilePicture(id, data);
    }

    @Put(':id/cover-photo')
    async updateCoverPhoto(
        @Param('id') id: string,
        @Body() data: Partial<Photographer>,
    ) {
        return await this.photographerService.updateCoverPhoto(id, data);
    }

    @Put(':id')
    async updateUser(
        @Param('id') id: string,
        @Body() data: Partial<Photographer>,
    ) {
        return await this.photographerService.updateUser(id, data);
    }

    @Put('contactdetails')
    async updateContactDetails(
        @Body() dto: contactDetailsDto,
    ) {
        return await this.photographerService.updateContactDetails(dto);
    }

    @Get('contactdetails/:id')
    async getContactDetails(@Param('id') id: string) {
        return await this.photographerService.getContactDetails(id);
    }

    @Post('packages/create')
    async createPackage(
        @Body() dto: createPackageDto,
    ) {
        return await this.photographerService.createPackage(dto);
    }

    @Put('packages/edit')
    async updatePackageDetails(
        @Body() dto: updatePackageDto,
    ) {
        return await this.photographerService.updatePackageDetails(dto);
    }

    @Get('packages/:photographerId')
    async getPackageDetails(@Param('photographerId') photographerId: string) {
        return await this.photographerService.getPackageDetails(photographerId);
    }

    @Get(':packageId/package')
    async getPackageById(@Param('packageId') packageId: string) {
        return await this.photographerService.getPackageById(packageId);
    }

    @Delete('packages/delete')
    async deletePackage(@Body() dto: deletePackageDto) {
        return await this.photographerService.deletePackageDetails(dto);
    }

    @Put(':packageId/coverphotos')
    async saveCoverPhotos(@Param('packageId') packageId: string, @Body() coverPhotos: Partial<Package>) {
        await this.photographerService.saveCoverPhotos(packageId, coverPhotos);
    }

    @Get('featured/:photographerId')
    async getFeatured(@Param('id') id: string) {
        return await this.photographerService.getFeatured(id);
    }

    @Put(':id/featured')
    async updateFeatured(@Param('id') id: string, @Body() featured: Partial<Photographer>) {
        await this.photographerService.updateFeatured(id, featured);
    }

}
