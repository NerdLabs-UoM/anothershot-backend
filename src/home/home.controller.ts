import { Controller, Get } from '@nestjs/common';
import { HomeService } from './home.service';

@Controller('api/home')
export class HomeController {
    constructor(private homeService: HomeService) { }

    @Get('feed')
    async getFeed() {
        return await this.homeService.getFeed();
    }
}
