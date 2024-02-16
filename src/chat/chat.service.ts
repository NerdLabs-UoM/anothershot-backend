import { ConflictException, Injectable } from '@nestjs/common';
import { ChatCreateDto } from './dto/chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageSendDto } from './dto/message.dto';

@Injectable()
export class ChatService {

    constructor(
        private prisma: PrismaService
    ) { }

    async sendMessage(dto: MessageSendDto) {
        return await this.prisma.message.create({
            data: {
                message: dto.message,
                sender: {
                    connect: {
                        id: dto.senderId
                    }
                },
                receiver: {
                    connect: {
                        id: dto.receiverId
                    }
                },
                chat: {
                    connect: {
                        id: dto.chatId
                    }
                }
            }
        });
    }

    getChatsByUserId(id: string) {
        return this.prisma.chat.findMany({
            where: {
                users: {
                    some: {
                        id: id
                    }
                }

            },
            include: {
                users: true,
                messages: {
                    orderBy: {
                        createdAt: 'asc'
                    },
                    include: {
                        sender: true,
                        receiver: true
                    }
                }
            }
        });
    }


    async create(dto: ChatCreateDto) {

        const chat = await this.prisma.chat.findFirst({
            where: {
                AND: [
                    {
                        users: {
                            some: {
                                id: dto.senderId
                            }
                        }
                    },
                    {
                        users: {
                            some: {
                                id: dto.receiverId
                            }
                        }
                    }
                ]
            }
        });

        if (chat) {
            throw new ConflictException({
                status: 409,
                message: 'Chat already exists',
                error: 'Chat already exists'
            });
        }

        const res = await this.prisma.chat.create({
            data: {
                messages: { 
                    create: {
                        message: 'Hello...',
                        sender: {
                            connect: {
                                id: dto.senderId
                            }
                        },
                        receiver: {
                            connect: {
                                id: dto.receiverId
                            }
                        }
                    }
                },
                users: {
                    connect: [
                        { id: dto.senderId },
                        { id: dto.receiverId }
                    ]
                }
            }
        });

        return res;
    }


}
