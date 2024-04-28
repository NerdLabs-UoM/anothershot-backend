import { Controller, Delete, Get, Patch } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientImageDto } from './dto/client.dto';
import { ClientDto } from './dto/client.dto';
import { DeleteBookingDto } from './dto/deleteBooking.dto';
import { Body, Param } from '@nestjs/common';
@Controller('api/client')
export class ClientController {
    constructor(private clientService: ClientService) { }

    @Patch(':id/profile/image')
    async updateImage(@Body() dto: ClientImageDto) {
        return await this.clientService.updateImage(dto);
    }

    @Patch(':id/profile')
    async updateProfile(@Body() dto: ClientDto) {
        return await this.clientService.updateProfile(dto);
    }

    @Get(':id/clientDetails')
    async getClientDetails(@Param('id') id: string) {
        return await this.clientService.getClientDetails(id);
    }

    @Get(':id/likeImages')
    async getLikedImages(@Param('id') id: string) {
        return await this.clientService.getLikedImages(id);
    }

    @Get(':id/savedImages')
    async getSavedImages(@Param('id') id:string){
        return await this.clientService.getSavedImages(id);
    }

    @Get(':id/clientBookings')
    async getBookings(@Param('id') clientId: string) {
      return await this.clientService.getBookings(clientId);
    }

    @Delete(':id/deleteBooking')
    async deleteBooking(@Body() dto: DeleteBookingDto) {
        return await this.clientService.deleteBooking(dto);
    }
}
