import {
  Controller,
  Get,
  Query,
  Logger,
  HttpException,
  HttpStatus,
  Delete,
  Put,
  Body,
  Param,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateSystemReportStatus } from './dto/reportDto.dto';

@Controller('api/admin')
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(private adminService: AdminService) {}

  @Get('getallusers')
  async getAllUsers(
    @Query('page') page: number,
    @Query('name') name: string,
    @Query('roles') roles: string
  ) {
    this.logger.log(
      `Fetching all users with page: ${page}, name: ${name}, roles: ${roles}`
    );

    try {
      const users = await this.adminService.findAll(page, name, roles);
      this.logger.log(`Successfully fetched users. Count: ${users.length}`);
      return users;
    } catch (error) {
      this.logger.error(
        `Failed to fetch users with page: ${page}, name: ${name}, roles: ${roles}`,
        error.stack
      );
      throw new HttpException(
        'Error fetching users',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('getlastpage')
  async getLastPage(
    @Query('name') name: string,
    @Query('roles') roles: string
  ) {
    this.logger.log(
      `Fetching last page for users with name: ${name}, roles: ${roles}`
    );

    try {
      const lastPage = await this.adminService.findLastPage(name, roles);
      this.logger.log(`Successfully fetched last page: ${lastPage}`);
      return lastPage;
    } catch (error) {
      this.logger.error(
        `Failed to fetch last page with name: ${name}, roles: ${roles}`,
        error.stack
      );
      throw new HttpException(
        'Error fetching last page',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('getallSystemReports')
  async getSystemReports(@Query('page') page: number) {
    this.logger.log(`Fetching all system reports`);

    try {
      const reports = await this.adminService.getSystemReports(page);
      this.logger.log(
        `Successfully fetched system reports. Count: ${reports.length}`
      );
      return reports;
    } catch (error) {
      this.logger.error(`Failed to fetch system reports`, error.stack);
      throw new HttpException(
        'Error fetching system reports',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('getlastSystemReportpage')
  async getLastPageSystemReports() {
    this.logger.log(`Fetching last page for system reports`);

    try {
      const lastPage = await this.adminService.findLastPageSystemReports();
      this.logger.log(`Successfully fetched last page: ${lastPage}`);
      return lastPage;
    } catch (error) {
      this.logger.error(
        `Failed to fetch last page for system reports`,
        error.stack
      );
      throw new HttpException(
        'Error fetching last page',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put('update-system-report-status')
  async updateReportStatus(@Body() dto: UpdateSystemReportStatus) {
    this.logger.log(`Updating system report status`);
    try {
      const updated = this.adminService.updateReportStatus(dto);
      this.logger.log(`Successfully updated system report status`);
      return updated;
    } catch (error) {
      this.logger.error(`Failed to update system report status`, error.stack);
      throw new HttpException(
        'Error updating system report status',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete('delete-report/:id')
  async deleteReport(@Param('id') id: string) {
    this.logger.log(`Deleting system report with ID: ${id}`);
    try {
      const deleted = this.adminService.deleteReport(id);
      this.logger.log(`Successfully deleted system report with ID: ${id}`);
      return deleted;
    } catch (error) {
      this.logger.error(`Failed to delete system report with ID: ${id}`);
      throw new HttpException(
        'Error deleting system report',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
