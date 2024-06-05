import { Controller, Get, Query, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HomeService } from './home.service';
import { PhotographerCategory } from '@prisma/client';

// HomeController
@Controller('api/home')
export class HomeController {
    private readonly logger = new Logger(HomeController.name);

    constructor(private homeService: HomeService) { }

    // Get feed
    @Get('feed')
    async getFeed() {
        this.logger.log('Fetching feed');
        try {
            return await this.homeService.getFeed();
        } catch (error) {
            this.logger.error(`Fetching feed failed: ${error.message}`, error.stack);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Search for photographers
    @Get('search')
    async search(
        @Query('name') name: string,
        @Query('category') category: PhotographerCategory,
        @Query('location') location: string,
    ) {
        this.logger.log(`Searching for photographers with name: ${name}, category: ${category}, location: ${location}`);
        try {
            return this.homeService.search(name, category, location);
        } catch (error) {
            this.logger.error(`Search failed: ${error.message}`, error.stack);
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
}
