import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { bankDetailsDto } from '../dto/bankDetails.dto';
import { Photographer, PhotographerCategory } from '@prisma/client';
import { PhotographerService } from '../photographer.service';
import { EarningsDto } from '../dto/earnings.dto';

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

  constructor(private prisma: PrismaService) {}

  async getBankDetails(photographerId: string) {
    this.logger.log(
      `Attempting to fetch bank details for photographer with ID: ${photographerId}`,
    );

    try {
      // Fetching the bank details associated with the specified photographer ID
      const bankDetails = await this.prisma.bankDetails.findUnique({
        where: {
          photographerId: photographerId,
        },
        select: {
          id: true,
          bankName: true,
          accountNumber: true,
          accountName: true,
          accountBranch: true,
          accountBranchCode: true,
        },
      });

      // Handling the case where bank details are not found
      this.logger.log(
        `Successfully fetched category for photographer with ID: ${photographerId}`,
      );
      return bankDetails;
    } catch (error) {
      this.logger.error(
        `Failed to fetch category for photographer with ID: ${photographerId}`,
        error.stack,
      );
      if (error instanceof NotFoundException) {
        throw error; // Re-throw if it's a not found exception.
      }
      throw new HttpException(
        'Error fetching category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

    async updateBankDetails(userId: string, dto: bankDetailsDto) {
      const excistingBankDetails = await this.prisma.bankDetails.findUnique({
        where: { photographerId: userId },
      });

      if (excistingBankDetails) {
        await this.prisma.bankDetails.update({
          where: { photographerId: userId },
          data: {
            bankName: dto.bankName,
            accountNumber: dto.accountNumber,
            accountName: dto.accountName,
            accountBranch: dto.accountBranch,
            accountBranchCode: dto.accountBranchCode
              ? dto.accountBranchCode
              : null,
          },
        });
      } else {
        await this.prisma.bankDetails.create({
          data: {
            photographer: {
              connect: {
                userId: userId,
              },
            },
            bankName: dto.bankName,
            accountNumber: dto.accountNumber,
            accountName: dto.accountName,
            accountBranch: dto.accountBranch,
            accountBranchCode: dto.accountBranchCode
              ? dto.accountBranchCode
              : undefined,
          },
        });
      }
      return await this.prisma.bankDetails.findUnique({
        where: { photographerId: userId },
      });
    }

    async getAllCategories() {
      this.logger.log('Attempting to fetch all photographer categories');

      try {
        // Fetching the predefined categories from the constants
        const categories = PhotographerCategory;

        this.logger.log('Successfully fetched all photographer categories');
        return categories;
      } catch (error) {
        this.logger.error('Failed to fetch photographer categories', error.stack);

        // Throwing an HTTP exception with internal server error status
        throw new HttpException(
          'Error fetching categories',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    async getCategoryById(id: string) {
      this.logger.log(
        `Attempting to fetch category for photographer with ID: ${id}`,
      );

      try {
        const category = await this.prisma.photographer.findUnique({
          where: {
            userId: id,
          },
          select: {
            category: true,
          },
        });

        this.logger.log(
          `Successfully fetched category for photographer with ID: ${id}`,
        );
        return category;
      } catch (error) {
        this.logger.error(
          `Failed to fetch category for photographer with ID: ${id}`,
          error.stack,
        );
        if (error instanceof NotFoundException) {
          throw error; // Re-throw if it's a not found exception.
        }
        throw new HttpException(
          'Error fetching category',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    async updateCategory(userId: string, data: Partial<Photographer>) {
      this.logger.log(
        `Attempting to update category for photographer with ID: ${userId}`,
      );

      try {
        const updatedPhotographer = await this.prisma.photographer.update({
          where: {
            userId: userId,
          },
          include: {
            user: true,
          },
          data: {
            category: {
              set: data.category,
            },
          },
        });

        this.logger.log(
          `Successfully updated category for photographer with ID: ${userId}`,
        );
        return updatedPhotographer;
      } catch (error) {
        this.logger.error(
          `Failed to update category for photographer with ID: ${userId}`,
          error.stack,
        );

        // Handling case where the photographer is not found
        if (error.code === 'P2025') {
          // P2025 is Prisma's code for a record not found error
          throw new NotFoundException(
            `Photographer with ID: ${userId} not found`,
          );
        }

        // General error handling
        throw new HttpException(
          'Error updating category',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    async getPayments(id: string) {
        this.logger.log(`Fetching payments for photographer with ID: ${id}`);
        try {
          const payments = await this.prisma.payment.findMany({
            where: {
              photographerId: id,
            },
            include: {
              client: {
                select: {
                  name: true,
                },
              },
            },
          });
          this.logger.log(
            `Successfully fetched payments for photographer with ID: ${id}`,
          );
          return payments;
        } catch (error) {
          this.logger.error(
            `Failed to fetch payments for photographer with ID: ${id}`,
            error.stack,
          );
          throw new Error('Error fetching payments');
        }
      }
    
      async getEarnings(id: string) {
        this.logger.log(`Calculating earnings for photographer with ID: ${id}`);
        try {
          // Fetch payments for the given photographer
          const payments = await this.prisma.payment.findMany({
            where: {
              photographerId: id,
            },
            select: {
              amount: true,
              status: true,
            },
          });
    
          let paidTot = 0;
          let pendingTot = 0;
    
          // Calculate total paid and pending amounts
          payments.forEach((payment) => {
            if (payment.status === 'PAID') {
              paidTot += payment.amount;
            } else if (payment.status === 'PENDING') {
              pendingTot += payment.amount;
            }
          });
    
          // Create the earnings DTO
          const earningsDtoData = new EarningsDto();
          earningsDtoData.fees = parseFloat((0.1 * paidTot).toFixed(2));// 10% fees
          earningsDtoData.totalAmount = parseFloat((paidTot - earningsDtoData.fees).toFixed(2));// Net earnings after fees
          earningsDtoData.pending =  parseFloat(pendingTot.toFixed(2)); // Total pending payments
    
          this.logger.log(
            `Successfully calculated earnings for photographer with ID: ${id}`,
          );
          return earningsDtoData;
        } catch (error) {
          this.logger.error(
            `Failed to calculate earnings for photographer with ID: ${id}`,
            error.stack,
          );
          throw new Error('Error calculating earnings');
        }
      }
    
}
