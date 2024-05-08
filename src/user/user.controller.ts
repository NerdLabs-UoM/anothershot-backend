import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Account, Client, User } from '@prisma/client';
import { UpdateUserDto, passwordResetDto } from './dto/user.dto';
import { SystemReportDto } from './dto/systemReport.dto';

@Controller('api/user')
export class UserController {
    constructor(private userService: UserService) { }

    // @UseGuards(JwtGuard)
    @Get(":id")
    async getUser(@Param("id") id: string) {
        return await this.userService.findById(id);
    }

    @Put('activate/:userId')
    async activateUser(@Param('userId') userId: string) {
        return await this.userService.activateUser(userId);
    }

    @Put('reset/:userId')
    async resetPassword(
        @Param('userId') userId: string,
        @Body() password: passwordResetDto,
    ) {
        return await this.userService.resetPassword(userId, password);
    }

    @Post('account/:userId')
    async linkAccount(
        @Param('userId') userId: string,
        @Body() data: Account,
    ) {
        return await this.userService.linkAccount(userId, data);
    }

    @Get("email/:email")
    async getUserByEmail(@Param("email") email: string) {
        return await this.userService.findByEmail(email);
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

    // --------- user settings controller ------------
    @Post('report/:id')
    async createSystemReport(@Param('id') id: string, @Body() dto: SystemReportDto) {
        return await this.userService.createSystemReport(id, dto);
    }

}
