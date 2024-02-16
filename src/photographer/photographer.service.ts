import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PhotographerService {
    constructor(private prisma: PrismaService) { }
    async findAll() {
        return await this.prisma.photographer.findMany({
            include: {
                user: true
            }
        });
    }
}
