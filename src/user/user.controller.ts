import { Body, Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Client, User } from '@prisma/client';
import { UpdateUserDto } from './dto/user.dto';

@Controller('api/user')
export class UserController {
    constructor(private userService: UserService) { }

    @UseGuards(JwtGuard)
    @Get(":id")
    async getUser(@Param("id") id: string) {
        return await this.userService.findById(id);
    }

    @Get(':id/profile')
    async finUserById(@Param("id") id: string) {
        return await this.userService.findUserById(id);
    }
    @Delete(':id/delete')
    async delete(@Param('id') id: string) {
        return this.userService.deleteUserById(id);
    }
    @Put(':id/adminupdate')
    async updateUser(
        @Param('id') id: string,
        @Body() data: UpdateUserDto,
    ) {
        return await this.userService.updateUserDetails(id, data);
    }

    @Put(':id/adminupdateclient')
    async updateClient(
        @Param('id') id: string,
        @Body() data: Partial<Client>,
    ) {
        return await this.userService.updateClient(id, data);
    }

    @Put(':id/adminupdateadmin')
    async updateAdmin(
        @Param('id') id: string,
        @Body() data: Partial<Client>,
    ) {
        return await this.userService.updateAdmin(id, data);
    }
   
    @Put(':id/suspend')
     async suspendUser(@Param('id') userId: string): Promise<void> {
        return await this.userService.updateSuspended(userId);
    } 
    @Put(':id/unlock')
     async unlockUser(@Param('id') userId: string): Promise<void> {
        return await this.userService.updateUnlock(userId);
    } 

}
