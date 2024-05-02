import { PrismaService } from "src/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { UserRole } from "@prisma/client";

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) { }

  async findall(page: number, name: string, roles: string) {

    const pageSize = 3;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const rolesArray = roles ? roles.split(',') : null; // Split the roles string into an array
    let whereClause = {}; // Define an empty object for the where clause

    if (name) {
      whereClause = { userName: { contains: name } }; // If name is provided, filter by username
    }
    if (roles) {
      whereClause = { ...whereClause, userRole: { in: rolesArray } }; // If roles is provided, filter by role
    }
    const values = await this.prisma.user.findMany({
      skip,
      take,
      where: whereClause,
      include: {
        reports: true
      }
    });
    return values;
  }

  async findLastPage(name: string,roles: string) {
    const pageSize = 3;
    let whereClause = {};

    const rolesArray = roles ? roles.split(',') : null;

    if (name) {
      whereClause = { userName: { contains: name } };
    }
    if (roles) {
      whereClause = { ...whereClause, userRole: { in: rolesArray } };
    }

    const total = await this.prisma.user.count({
      where: whereClause
    });
    const lastPage = Math.ceil(total / pageSize);
    return lastPage;
  }

}