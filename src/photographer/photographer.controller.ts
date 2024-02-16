import { Controller, Get } from '@nestjs/common';
import { PhotographerService } from './photographer.service';

@Controller('api/photographer')
export class PhotographerController {
    constructor(private photographerService: PhotographerService) { }

    @Get('get/all')
    async getAllPhotographers() {
        return await this.photographerService.findAll();
    }
}
