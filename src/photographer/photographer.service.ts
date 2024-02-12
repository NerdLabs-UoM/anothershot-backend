import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdatePhotographerDto } from "./dto/photographer.dto";

@Injectable()
export class PhotographerService {
    constructor(private prisma: PrismaService) { }

    async findByEmail(email: string) {
        return await this.prisma.user.findUnique({
            where: {
                email: email,
            },
        });
    }

    async findById(id: string) {
        return await this.prisma.photographer.findUnique({
            where: {
                id : id,
            },
            
        });
    }
    
    async findall(){
        return await this.prisma.photographer.findMany();
    }

    async update(userId: string,data:UpdatePhotographerDto){
        const existingUser = await this.prisma.photographer.findUnique({
          where: { id: userId },
        });
    
        if (!existingUser) {
          throw new NotFoundException(`User with ID ${userId} not found`);
        }
    
        const updatedUser = await this.prisma.photographer.update({
          where: { id: userId },
          data: data
        });
    
        return updatedUser;
      }

    //   async updateCoverImage(userId: string,coverImage:string){
    //     const existingUser = await this.prisma.photographer.findUnique({
    //         where: { id: userId },
    //       });
      
    //       if (!existingUser) {
    //         throw new NotFoundException(`User with ID ${userId} not found`);
    //       }
      
    //       const updatedUser = await this.prisma.photographer.update({
    //         where: { id: userId },
    //         data.coverImageUrl: coverImage
    //       });
      
    //       return updatedUser;
    //   }
}