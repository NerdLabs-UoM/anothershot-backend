import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DashboardService } from './dashboard.service';


@Controller('api/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('totalRevenue')
  async getTotalRevenue() {
    return this.dashboardService.getTotalRevenue();
  }

  @Get('totalUsers')
  async getTotalUsers() {
    return this.dashboardService.getTotalUsers();
  }

  @Get('totalBookings')
  async getTotalBookings() {
    return this.dashboardService.getTotalBookings();
  }

  @Get('activeUsers')
  async getActiveUsers() {
    return this.dashboardService.getActiveUsers();
  }

  @Get('recentPayments')
  async getRecentPayments() {
    return this.dashboardService.getRecentPayments();
  }

  
}
