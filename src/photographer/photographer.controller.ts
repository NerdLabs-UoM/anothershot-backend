import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { PhotographerService } from './photographer.service';
import { UpdatePhotographerDto } from './dto/photographer.dto';

@Controller('api/photographer')
export class PhotographerController {
    constructor(private photographerServise: PhotographerService) { }

    @Get('getallusers')
    async getAllUsers() {
        return await this.photographerServise.findall();
    }

    @Get(":id")
    async getUser(@Param("id" ) id: string) {
        return await this.photographerServise.findById(id);   
    }

    @Put(":id")
    async updateUser(@Param("id" ) id: string, @Body() data: UpdatePhotographerDto) {
        return await this.photographerServise.update(id,data);
    }

    // @Put(':id/cover-image')
    // async updateCoverImage(@Body('coverImage') coverImage: string): Promise<any> {
    //   try {
    //     const updatedUser = await this.photographerServise.updateCoverImage(coverImage);
    //     return { message: 'Cover image updated successfully', user: updatedUser };
    //   } catch (error) {
    //     console.error('Error updating cover image:', error);
    //     throw new Error('Failed to update cover image');
    //   }
    // }

    

}