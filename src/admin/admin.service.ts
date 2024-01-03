import { PrismaService } from "src/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) { }
  
  async findall(){
    return await this.prisma.user.findMany();
  }
                  
}