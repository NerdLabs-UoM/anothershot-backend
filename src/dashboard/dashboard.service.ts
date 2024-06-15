import { PrismaService } from 'src/prisma/prisma.service';
import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";


@Injectable()

export class DashboardService {

  private readonly logger = new Logger(DashboardService.name);
  
  constructor(private prisma: PrismaService) { }
  async getTotalBookings() {
    const total = await this.prisma.booking.count();
    return total;
  }
}