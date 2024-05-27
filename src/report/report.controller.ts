import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto, reportImageDto } from './dto/create-report.dto';
import { UpdateImageReportStatus, UpdateReportStatus } from './dto/update-report.dto';

@Controller('api/report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  // -------- Cretate Reports --------------------------------
  
  @Post('create-report')
  create(@Body() createReportDto: CreateReportDto) {
    return this.reportService.create(createReportDto);
  }

  

  @Post('report-image')
  async reportImage(@Body() createReportDto: reportImageDto) {
    return await this.reportService.createImageReport(createReportDto);
  }
  // ------ Admin get all profile reports --------------------------------
  @Get('getallreports')
  async getAllUsers(@Query('page') page: number, @Query('name') name: string) {
    const reports = await this.reportService.findall(page, name);
    return reports;
  }

  @Get('getlastpage')
  async getLastPage(
    @Query('name') name: string,
  ) {
    try {
      return await this.reportService.findLastPage(name);
    } catch (err) {
      throw Error('Could not find Report');
    }
  }

  // ------ Admin get all Image reports --------------------------------

  @Get('getallimagereports')
  async getImageReports(
    @Query('page') page: number,
    @Query('name') name: string,
  ) {
    const reports = await this.reportService.findallImageReports(page, name);
    return reports;
  }

  @Get('getlastImageReportpage')
  async getLastImageReportPage(@Query('name') name: string) {
    try {
      return await this.reportService.findLastImageReportPage(name);
    } catch (err) {
      throw Error('Could not find Image Report');
    }
  }

  @Put('update-image-report-status')
  async update(@Body() updateReportDto: UpdateImageReportStatus) {
    return this.reportService.updateImageReportStatus(updateReportDto);
  }

  @Put('update-report-status')
  async updateReportStatus(@Body() updateReportDto: UpdateReportStatus) {
    return this.reportService.updateReportStatus(updateReportDto);
  }
}
