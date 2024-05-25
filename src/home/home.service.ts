import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PhotographerCategory } from '@prisma/client';

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

    async search(
        name: string,
        category: PhotographerCategory,
        location: string
    ) {

        const where: Prisma.PhotographerWhereInput = {}

        if (name) {
            where.name = {
                contains: name,
                mode: 'insensitive',
            };
        }
        if (category) {
            where.category = {
                has: category,
            };
        }

        if (location) {
            where.contactDetails = {
                address: {
                    city: {
                        contains: location,
                        mode: 'insensitive',
                    },
                },
            };
        }

        return await this.prisma.photographer.findMany({
            where,
            select: {
                id: false,
                userId: true,
                name: true,
                coverPhoto: false,
                bio: false,
                featured: false,
                category: true,
                createdAt: true,
                updatedAt: true,
                contactDetails: {
                    select: {
                        address: true,
                        phoneNum1: true,
                        email: true,
                    }
                },
                testimonial: {
                    select: {
                        rating: true,
                    }
                },
                user: {
                    select: {
                        image: true,
                    }
                }
            }
        }
        )
    }
}
