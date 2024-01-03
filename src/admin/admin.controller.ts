import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('api/admin')
export class AdminController {
    constructor(private adminService: AdminService) { }

    @Get('getallusers')
    async getAllUsers() {
        return await this.adminService.findall();
    }

}
