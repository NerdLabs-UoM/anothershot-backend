import { PrismaService } from 'src/prisma/prisma.service';
import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";

@Injectable()

export class DashboardService {

  private readonly logger = new Logger(DashboardService.name);
  
  constructor(private prisma: PrismaService) { }
  

async getTotalRevenue() {
  const totalRevenue = await this.prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
  });
  return totalRevenue._sum.amount || 0;
}

  async getTotalUsers() {
    const totalUsers = await this.prisma.user.count({
    });
    return totalUsers;
  }

  async getTotalBookings() {
    const totalBookings = await this.prisma.booking.count();
    return totalBookings;
  }

  async getActiveUsers() {
    const activeUsers = await this.prisma.user.count({
      where: {
        isActive: true,
      },
    });
  }

  async getRecentPayments() {
    const recentPayments = await this.prisma.payment.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        client: {
          select: {
            name: true,
        },
      },
    },
  });
    return recentPayments;
  }
}