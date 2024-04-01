import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HomeService {

    constructor(private prisma: PrismaService) { }

    async getFeed() {
        return await this.prisma.feedImage.findMany(
            {
                include: {
                    photographer: {
                        select: {
                            user: true,
                            name: true,
                        }
                    },
                },
                orderBy: {
                    createdAt: 'desc'
                },
            }
        )
    }
}
