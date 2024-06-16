import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException, HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { DashboardDto } from './dto/dashboard.dto';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Fetch total revenue from payments
  async getTotalRevenue(): Promise<number> {
    try {
      this.logger.log('Fetching total revenue from payments');
      const totalRevenue = await this.prisma.payment.aggregate({
        _sum: {
          amount: true,
        },
      });
      const revenue = totalRevenue._sum.amount || 0;
      this.logger.log(`Total revenue fetched: ${revenue}`);
      return revenue;
    } catch (error) {
      this.logger.error('Failed to fetch total revenue', error);
      throw new Error('Could not fetch total revenue');
    }
  }

  // Fetch total number of users
  async getTotalUsers(): Promise<number> {
    try {
      this.logger.log('Fetching total number of users');
      const totalUsers = await this.prisma.user.count();
      this.logger.log(`Total users fetched: ${totalUsers}`);
      return totalUsers;
    } catch (error) {
      this.logger.error('Failed to fetch total users', error);
      throw new Error('Could not fetch total users');
    }
  }

  // Fetch total number of bookings
  async getTotalBookings(): Promise<number> {
    try {
      this.logger.log('Fetching total number of bookings');
      const totalBookings = await this.prisma.booking.count();
      this.logger.log(`Total bookings fetched: ${totalBookings}`);
      return totalBookings;
    } catch (error) {
      this.logger.error('Failed to fetch total bookings', error);
      throw new Error('Could not fetch total bookings');
    }
  }

  // Fetch number of active users (active within the last 10 minutes)
  async getActiveUsers(): Promise<number> {
    const activeThreshold = new Date(Date.now() - 10 * 60 * 1000); // Last 10 minutes
    try {
      this.logger.log('Fetching number of active users');
      const activeUsers = await this.prisma.user.count({
        where: {
          isActive: true,
          lastActivity: {
            gte: activeThreshold,
          },
        },
      });
      const activeCount = activeUsers || 0;
      this.logger.log(`Active users fetched: ${activeCount}`);
      return activeCount;
    } catch (error) {
      this.logger.error('Failed to fetch active users', error);
      throw new Error('Could not fetch active users');
    }
  }

  // Fetch recent payments for a specific client
  async getRecentPayments(dto: DashboardDto) {
    this.logger.log('Fetching recent payments');
    try {
      const recentPayments = await this.prisma.payment.findMany({
        where: {
          amount: { gt: 0 },
          client: {
            id: dto.clientId,
          },
        },
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          amount: true,
          createdAt: true,
          client: {
            select: {
              name: true,
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
      });

      if (!recentPayments) {
        throw new BadRequestException('No recent payments found');
      }

      this.logger.log(`Recent payments fetched: ${JSON.stringify(recentPayments)}`);
      return recentPayments;
    } catch (error) {
      this.logger.error('Failed to fetch recent payments', error);
      throw new BadRequestException('Could not fetch recent payments');
    }
  }

  async getMonthlyTotals() {
    const payments = await this.prisma.payment.groupBy({
      by: ['createdAt'],
      _sum: {
        amount: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const monthlyTotals = payments.reduce((acc, payment) => {
      const month = payment.createdAt.getMonth();
      const year = payment.createdAt.getFullYear();
      const key = `${year}-${month + 1}`;

      if (!acc[key]) {
        acc[key] = { name: key, total: 0 };
      }

      acc[key].total += payment._sum.amount;
      return acc;
    }, {});

    return Object.values(monthlyTotals);
  }
}
