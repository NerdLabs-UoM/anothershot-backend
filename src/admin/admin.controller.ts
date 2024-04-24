import { Controller, Get, Query } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('api/admin')
export class AdminController {
    constructor(private adminService: AdminService) { }

    @Get('getallusers')
    async getAllUsers(@Query('page') page: number ,@Query('name') name:string) {
        try{
            return await this.adminService.findall(page,name);
        }catch(err){
            console.log(err);
        }
    }

    @Get('getlastpage')
    async getLastPage(@Query('name') name: string) {
        try{
            return await this.adminService.findLastPage(name);
        }catch(err){
            console.log(err);
        }
    }
}
