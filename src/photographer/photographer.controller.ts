import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { PhotographerService } from './photographer.service';
import { UpdatePhotographerDto } from './dto/photographer.dto';
import { Photographer, User } from '@prisma/client';
import { contactDetailsDto } from './dto/contactDetails.dto';
@Controller('api/photographer')
export class PhotographerController {
    constructor(private photographerService: PhotographerService) { }

    @Get('getallusers')
    async getAllUsers() {
        return await this.photographerService.findall();
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
    }y

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
}
