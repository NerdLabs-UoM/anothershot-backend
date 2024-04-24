import { PrismaService } from "src/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) { }
  
  async findall(page:number,name:string){
    const pageSize = 3;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    let whereClause = {}; // Define an empty object for the where clause

    if(name){
      whereClause = { userName: { contains: name } }; // If name is provided, filter by username
    }
    const values = await this.prisma.user.findMany({
      skip,
      take,
      where: whereClause,
      include:{
      reports:true
    }
    });
    return values;
  } 

  async findLastPage(name:string){
    const pageSize = 3;
    let whereClause = {};

    if(name){
      whereClause = { userName: { contains: name } };
    }

    const total = await this.prisma.user.count({
      where: whereClause
    });
    const lastPage = Math.ceil(total / pageSize);
    return lastPage;
  }
            
}