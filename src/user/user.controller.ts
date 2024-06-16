// UserController

import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Account, Client, User } from '@prisma/client';
import { UpdateUserDto, PasswordResetDto } from './dto/user.dto';
import { SystemReportDto } from './dto/systemReport.dto';

@Controller('api/user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private userService: UserService) {}

  // User APIs

  @Get(":id")
  async getUser(@Param("id") id: string) {
    this.logger.log(`Fetching user with ID: ${id}`);
    try {
      return await this.userService.findById(id);
    } catch (error) {
      this.logger.error(`Error fetching user with ID: ${id}`, error.stack);
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get("email/:email")
  async getUserByEmail(@Param("email") email: string) {
    this.logger.log(`Fetching user with email: ${email}`);
    try {
      return await this.userService.findByEmail(email);
    } catch (error) {
      this.logger.error(`Error fetching user with email: ${email}`, error.stack);
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':id/profile')
  async findUserById(@Param("id") id: string) {
    this.logger.log(`Fetching user profile with ID: ${id}`);
    try {
      return await this.userService.findUserById(id);
    } catch (error) {
      this.logger.error(`Error fetching user profile with ID: ${id}`, error.stack);
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id/delete')
  async delete(@Param('id') id: string) {
    this.logger.log(`Deleting user with ID: ${id}`);
    try {
      return await this.userService.deleteUserById(id);
    } catch (error) {
      this.logger.error(`Error deleting user with ID: ${id}`, error.stack);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put('activate/:userId')
  async activateUser(@Param('userId') userId: string) {
    this.logger.log(`Activating user with ID: ${userId}`);
    try {
      return await this.userService.activateUser(userId);
    } catch (error) {
      this.logger.error(`Error activating user with ID: ${userId}`, error.stack);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put('reset/:userId')
  async resetPassword(
    @Param('userId') userId: string,
    @Body() password: PasswordResetDto,
  ) {
    this.logger.log(`Resetting password for user with ID: ${userId}`);
    try {
      return await this.userService.resetPassword(userId, password);
    } catch (error) {
      this.logger.error(`Error resetting password for user with ID: ${userId}`, error.stack);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('account/:userId')
  async linkAccount(
    @Param('userId') userId: string,
    @Body() data: Account,
  ) {
    this.logger.log(`Linking account for user with ID: ${userId}`);
    try {
      return await this.userService.linkAccount(userId, data);
    } catch (error) {
      this.logger.error(`Error linking account for user with ID: ${userId}`, error.stack);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id/adminupdate')
  async updateUser(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
  ) {
    this.logger.log(`Updating user with ID: ${id}`);
    try {
      return await this.userService.updateUserDetails(id, data);
    } catch (error) {
      this.logger.error(`Error updating user with ID: ${id}`, error.stack);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id/adminupdateclient')
  async updateClient(
    @Param('id') id: string,
    @Body() data: Client,
  ) {
    this.logger.log(`Updating client with ID: ${id}`);
    try {
      return await this.userService.updateClient(id, data);
    } catch (error) {
      this.logger.error(`Error updating client with ID: ${id}`, error.stack);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // System Report API

  @Post(':id/systemreport')
  async createSystemReport(
    @Param('id') id: string,
    @Body() data: SystemReportDto,
  ) {
    this.logger.log(`Creating system report for user with ID: ${id}`);
    try {
      return await this.userService.createSystemReport(id, data);
    } catch (error) {
      this.logger.error(`Error creating system report for user with ID: ${id}`, error.stack);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
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
