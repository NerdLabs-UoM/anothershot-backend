import { PrismaService } from "src/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) { }
  
  async findall(page:number){
    const pageSize = 3;
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const values = await this.prisma.user.findMany({skip,take});
    return values;
  } 

  async findLastPage(){
    const pageSize = 3;
    const total = await this.prisma.user.count();
    const lastPage = Math.ceil(total / pageSize);
    return lastPage;
  }
            
}