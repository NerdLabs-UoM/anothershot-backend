import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ClientImageDto } from './dto/client.dto';
import { ClientDto } from './dto/client.dto';

@Injectable()
export class ClientService {
    constructor(private prisma: PrismaService) {}

    async updateImage(dto: ClientImageDto) {
        return await this.prisma.user.update({
            where: {
                id: dto.clientId,
            },
            data: {
                image: dto.image,
            },
        });
    }

    async updateProfile(dto: ClientDto) {
        return await this.prisma.client.update({
            where: {
                userId: dto.clientId,
            },
            data: {
                name: dto.name,
                bio: dto.bio,
            },
        });
    }

    async getClientDetails(id: string) {
        return await this.prisma.client.findUnique({
            where: {
                userId: id,
            },
            select: {
                name: true,
                bio: true,
                user: {
                    select:{
                        image: true,
                        userName: true,
                    }
                },
            }
        });
    }

    async getLikedImages(id: string) {
        return await this.prisma.user.findMany({
            where: {
                id: id,
            },
            select: {
                likedFeedImages: {
                    select: {
                        id: true,
                        imageUrl: true,
                        photographerId: true,
                    }
                }
            },
        })
    }

    async getSavedImages(id: string) {
        return await this.prisma.user.findMany({
            where:{
                id: id,
            },
            select:{
                savedFeedImages: {
                    select: {
                        id: true,
                        imageUrl: true,
                        photographerId: true,
                    }
                },
            }
        })
    }

    async getBookings(clientId: string) {
        return await this.prisma.booking.findMany({
            where: {
                clientId: clientId,
            },
            select: {
                id: true,
                subject: true,
                category: true,
                startdate: true,
                status: true,
                location: true,
                client: {
                    select: {
                        name: true,
                    },
                },
                photographer: {
                    select: {
                       name: true,
                       userId: true,
                       user: {
                            select: {
                                 image: true,
                            }
                          },
                    },
                },
                offer: {
                    select: {
                        price: true,
                    },
                },
                package: {
                    select: {
                        name: true,
                    },
                },
        },
        orderBy: {
            id: 'desc',
          },
        });
    }

}
