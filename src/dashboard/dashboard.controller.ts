import { Controller, Get, Post, Body, Patch, Param, Delete ,Query, Logger, UsePipes, ValidationPipe, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardDto } from './dto/dashboard.dto';


@Controller('api/dashboard')
export class DashboardController {
  private readonly logger = new Logger(DashboardController.name);

  constructor(private readonly dashboardService: DashboardService) {}

  @Get('totalRevenue')
  async getTotalRevenue() {
    this.logger.log('Request received to get total revenue');
    try {
      const totalRevenue = await this.dashboardService.getTotalRevenue();
      this.logger.log(`Total revenue retrieved: ${totalRevenue}`);
      return totalRevenue;
    } catch (error) {
      this.logger.error('Failed to get total revenue', error);
      throw new Error('Could not fetch total revenue');
    }
  }

  // Endpoint to get total users
  @Get('totalUsers')
  async getTotalUsers() {
    this.logger.log('Request received to get total users');
    try {
      const totalUsers = await this.dashboardService.getTotalUsers();
      this.logger.log(`Total users retrieved: ${totalUsers}`);
      return totalUsers;
    } catch (error) {
      this.logger.error('Failed to get total users', error);
      throw new Error('Could not fetch total users');
    }
  }

  // Endpoint to get total bookings
  @Get('totalBookings')
  async getTotalBookings() {
    this.logger.log('Request received to get total bookings');
    try {
      const totalBookings = await this.dashboardService.getTotalBookings();
      this.logger.log(`Total bookings retrieved: ${totalBookings}`);
      return totalBookings;
    } catch (error) {
      this.logger.error('Failed to get total bookings', error);
      throw new Error('Could not fetch total bookings');
    }
  }

  // Endpoint to get active users
  @Get('activeUsers')
  async getActiveUsers() {
    this.logger.log('Request received to get active users');
    try {
      const activeUsers = await this.dashboardService.getActiveUsers();
      this.logger.log(`Active users retrieved: ${activeUsers}`);
      return activeUsers;
    } catch (error) {
      this.logger.error('Failed to get active users', error);
      throw new Error('Could not fetch active users');
    }
  }

  // Endpoint to get recent payments for a specific client
  @Get('recentPayments')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getRecentPayments( dto: DashboardDto) {
    this.logger.log('Request received to get recent payments');
    try {
      const recentPayments = await this.dashboardService.getRecentPayments();
      this.logger.log(`Recent payments retrieved: ${JSON.stringify(recentPayments)}`);
      return recentPayments;
    } catch (error) {
      this.logger.error('Failed to get recent payments', error);
      throw new BadRequestException('Could not fetch recent payments');
    }
  }

  @Get('monthlyTotals')
  async getMonthlyTotals() {
    this.logger.log('Request received to get monthly totals');
    try {
      const monthlyTotals = await this.dashboardService.getMonthlyTotals();
      this.logger.log(`Monthly totals retrieved: ${JSON.stringify(monthlyTotals)}`);
      return monthlyTotals;
    } catch (error) {
      this.logger.error('Failed to get monthly totals', error);
      throw new InternalServerErrorException('Could not fetch monthly totals');
    }
  }
  
}
