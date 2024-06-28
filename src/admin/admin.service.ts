import { PrismaService } from 'src/prisma/prisma.service';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UpdateSystemReportStatus } from './dto/reportDto.dto';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(page: number, name: string, roles: string) {
    const pageSize = 3;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const rolesArray = roles ? roles.split(',') : null; // Split the roles string into an array
    let whereClause = {}; // Define an empty object for the where clause

    if (name) {
      whereClause = {
        userName: {
          contains: name,
          mode: 'insensitive',
        },
      }; // If name is provided, filter by username
    }

    if (roles) {
      whereClause = { ...whereClause, userRole: { in: rolesArray } }; // If roles is provided, filter by role
    }

    this.logger.log(
      `Fetching users with filters - Page: ${page}, Name: ${name}, Roles: ${roles}`
    );

    try {
      const users = await this.prisma.user.findMany({
        skip,
        take,
        where: whereClause,
        include: {
          systemReports: true, // Include related reports
        },
      });

      this.logger.log(`Found ${users.length} users with the provided filters.`);
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

  async findLastPage(name: string, roles: string) {
    const pageSize = 3; // Define the page size
    let whereClause = {}; // Initialize an empty where clause

    const rolesArray = roles ? roles.split(',') : null; // Split roles into an array if provided

    if (name) {
      whereClause = {
        userName: {
          contains: name,
          mode: 'insensitive',
        },
      }; // If name is provided, add it to the where clause
    }

    if (roles) {
      whereClause = { ...whereClause, userRole: { in: rolesArray } }; // If roles are provided, add them to the where clause
    }

    this.logger.log(
      `Calculating last page for filters - Name: ${name}, Roles: ${roles}`
    );

    try {
      const totalUsers = await this.prisma.user.count({
        where: whereClause, // Use the where clause to count the total matching users
      });

      const lastPage = Math.ceil(totalUsers / pageSize); // Calculate the last page number
      this.logger.log(
        `Total users: ${totalUsers}. Calculated last page: ${lastPage}.`
      );
      return lastPage;
    } catch (error) {
      this.logger.error(
        `Failed to calculate last page for name: ${name}, roles: ${roles}`,
        error.stack
      );
      throw new HttpException(
        'Error calculating last page',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findLastPageSystemReports() {
    const pageSize = 3;
    try {
      const totalUsers = await this.prisma.systemReport.count({});
      const lastPage = Math.ceil(totalUsers / pageSize); // Calculate the last page number
      this.logger.log(
        `Total system reports: ${totalUsers}. Calculated last page: ${lastPage}.`
      );
      this.logger.log(`Successfully fetched last page: ${lastPage}`);
      return lastPage;
    } catch (error) {
      this.logger.error(
        'Failed to calculate the last page of system reports',
        error.stack
      );
      throw new HttpException(
        'Error calculating the last page of system reports',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getSystemReports(page: number) {
    const pageSize = 3;
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    try {
      // Log the request to fetch system reports for a specific page
      this.logger.log(
        `Fetching system reports for page ${page} with page size ${pageSize}`
      );

      // Fetch the system reports from the database
      const reports = await this.prisma.systemReport.findMany({
        skip,
        take,
        include: {
          user: {
            select: {
              userName: true,
              image: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Log the success of fetching the reports
      this.logger.log(
        `Successfully fetched ${reports.length} reports for page ${page}`
      );

      return reports;
    } catch (error) {
      // Log the error if fetching the reports fails
      this.logger.error(
        `Failed to fetch system reports for page ${page}`,
        error.stack
      );
      throw new HttpException(
        'Error fetching system reports',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateReportStatus(dto: UpdateSystemReportStatus) {
    try {
      // Log the request to update the status of a report
      this.logger.log(
        `Updating status of system report with ID: ${dto.id} to ${dto.status}`
      );

      // Update the report status in the database
      const updatedReport = await this.prisma.systemReport.update({
        where: {
          id: dto.id,
        },
        data: {
          status: dto.status,
        },
      });

      // Log the success of updating the report status
      this.logger.log(
        `Successfully updated status of system report with ID: ${dto.id} to ${dto.status}`
      );

      return updatedReport;
    } catch (error) {
      // Log the error if updating the report status fails
      this.logger.error(
        `Failed to update status of system report with ID: ${dto.id}`,
        error.stack
      );
      throw new HttpException(
        'Error updating system report status',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteReport(id: string) {
    // Log the request to delete a report
    this.logger.log(`Deleting system report with ID: ${id}`);

    if (!id) {
      throw new HttpException('Report ID not found', HttpStatus.BAD_REQUEST);
    } else {
      try {
        // Delete the report from the database
        await this.prisma.systemReport.delete({
          where: {
            id,
          },
        });

        // Log the success of deleting the report
        this.logger.log(`Successfully deleted system report with ID: ${id}`);
      } catch (error) {
        // Log the error if deleting the report fails
        this.logger.error(
          `Failed to delete system report with ID: ${id}`,
          error.stack
        );
        throw new HttpException(
          'Error deleting system report',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }
}
