import { Controller, Get, Query } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('api/admin')
export class AdminController {
    constructor(private adminService: AdminService) { }

    @Get('getallusers')
    async getAllUsers(@Query('page') page: number) {
        try{
            return await this.adminService.findall(page);
        }catch(err){
            console.log(err);
        }
    }

    @Get('getlastpage')
    async getLastPage() {
        try{
            return await this.adminService.findLastPage();
        }catch(err){
            console.log(err);
        }
    }

}
