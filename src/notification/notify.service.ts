import { PrismaService } from 'src/prisma/prisma.service';
import {
    Injectable,
} from '@nestjs/common';
import { Photographer, User } from '@prisma/client';
import { CreateNotifyDto, UpdateNotifyDto } from './dto/create-notify.dto';


@Injectable()
export class NotifyService {
    constructor(private prisma: PrismaService) { }

    async getNotifications(id: string) {
        return await this.prisma.notification.findMany({
            where: {
                receiverId: id
            },
            select: {
                id: true,
                type: true,
                title: true,
                description: true,
                read: true,
                createdAt: true,
                receiver: {
                    select: {
                        id: true,
                    }
                }
            }
        })
    }

    async createNotification(dto: CreateNotifyDto) {
        const notification = await this.prisma.notification.create({
            data: {
                receiver: {
                    connect: {
                        id: dto.receiverId,
                    },
                },
                type: dto.type,
                title: dto.title,
                description: dto.description ? dto.description : "",
            }
        })
    }

    async updateNotify(dto: UpdateNotifyDto) {
        return await this.prisma.notification.update({
            where: {
                id: dto.id
            },
            data: {
                read: dto.read
            }
        })
    }
}