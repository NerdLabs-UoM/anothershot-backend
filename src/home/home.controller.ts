import { Controller, Get, Query } from '@nestjs/common';
import { HomeService } from './home.service';
import { PhotographerCategory } from '@prisma/client';

@Controller('api/home')
export class HomeController {
    constructor(private homeService: HomeService) { }

    @Get('feed')
    async getFeed() {
        return await this.homeService.getFeed();
    }

    @Get('search')
    async search(
        @Query('name') name: string,
        @Query('category') category: PhotographerCategory,
        @Query('location') location: string,
    ) {
        return this.homeService.search(name, category, location);
    }
}
