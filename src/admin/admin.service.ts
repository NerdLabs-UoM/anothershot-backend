import { PrismaService } from "src/prisma/prisma.service";
import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { UserRole } from "@prisma/client";

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);
  
  constructor(private prisma: PrismaService) { }

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
          mode: 'insensitive'
        }
      }; // If name is provided, filter by username
    }

    if (roles) {
      whereClause = { ...whereClause, userRole: { in: rolesArray } }; // If roles is provided, filter by role
    }

    this.logger.log(`Fetching users with filters - Page: ${page}, Name: ${name}, Roles: ${roles}`);

    try {
      const users = await this.prisma.user.findMany({
        skip,
        take,
        where: whereClause,
        include: {
          reports: true // Include related reports
        }
      });

      this.logger.log(`Found ${users.length} users with the provided filters.`);
      return users;
    } catch (error) {
      this.logger.error(`Failed to fetch users with page: ${page}, name: ${name}, roles: ${roles}`, error.stack);
      throw new HttpException('Error fetching users', HttpStatus.INTERNAL_SERVER_ERROR);
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
          mode: 'insensitive'
        }
      }; // If name is provided, add it to the where clause
    }

    if (roles) {
      whereClause = { ...whereClause, userRole: { in: rolesArray } }; // If roles are provided, add them to the where clause
    }

    this.logger.log(`Calculating last page for filters - Name: ${name}, Roles: ${roles}`);

    try {
      const totalUsers = await this.prisma.user.count({
        where: whereClause // Use the where clause to count the total matching users
      });

      const lastPage = Math.ceil(totalUsers / pageSize); // Calculate the last page number
      this.logger.log(`Total users: ${totalUsers}. Calculated last page: ${lastPage}.`);
      return lastPage;
    } catch (error) {
      this.logger.error(`Failed to calculate last page for name: ${name}, roles: ${roles}`, error.stack);
      throw new HttpException('Error calculating last page', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}