import { PrismaService } from 'src/prisma/prisma.service';
import {
    Injectable,
} from '@nestjs/common';
import { CreateNotifyDto, UpdateNotifyDto } from './dto/create-notify.dto';
import { AppGateway } from 'src/app.gateway';

@Injectable()
export class NotifyService {
    constructor(private prisma: PrismaService,
        private socketGateway: AppGateway
    ) { }

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
        const senderName = await this.prisma.user.findUnique({
            where:{
                id:dto.senderId
            }
        })
        const notification = await this.prisma.notification.create({
            data: {
                receiver: {
                    connect: {
                        id: dto.receiverId,
                    },
                },
                type: dto.type,
                title:(dto.senderId === dto.receiverId)? `You ${dto.title}`:senderName.userName +" "+ dto.title,
                description: dto.description ? dto.description : "",
            }
        })
        

        await this.socketGateway.handleNewNotification(notification);
        return notification
    }

    async updateNotify(dto: UpdateNotifyDto) {
        const updatedNotify = await this.prisma.notification.update({
            where: {
                id: dto.notifyId
            },
            data: {
                read: dto.read
            }
        })

        return updatedNotify;
    }

    async deleteNotify(notifyId: string,userId:string) {
        const deleted =  await this.prisma.notification.delete({
            where: {
                id: notifyId
            }
        })

        return deleted;
    }
}