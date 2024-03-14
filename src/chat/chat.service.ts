import { ConflictException, Injectable } from '@nestjs/common';
import { ChatCreateDto } from './dto/chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageSendDto } from './dto/message.dto';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatService {

    constructor(
        private prisma: PrismaService,
        private socketGateway: ChatGateway
    ) { }

    async getChatsByChatId(chatId: string) {
        return await this.prisma.chat.findUnique({
            where: {
                id: chatId,
            },
            include: {
                users: true,
                messages: {
                    include: {
                        sender: true,
                        receiver: true,
                        attachments: true
                    }
                },
            }
        });
    }

    async sendMessage(dto: MessageSendDto) {
        const message = await this.prisma.message.create({
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
                },
                attachments: {
                    create: dto.attachments
                }
            }
        });

        await this.socketGateway.handleSendMessage(dto);

        return message;
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
                        receiver: true,
                        attachments: true
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
            },
            include: {
                users: true,
                messages: {
                    include: {
                        sender: true,
                        receiver: true,
                        attachments: true
                    }
                }
            }
        });

        await this.socketGateway.handleNewChat(res, dto.receiverId);

        return res;
    }

    async deleteChat(userId: string, chatId: string) {
        const chat = await this.prisma.chat.findUnique({
            where: {
                id: chatId
            },
            include: {
                users: true
            }
        });
        const receiver = chat.users.find(user => user.id !== userId);
        if (chat.users.some(user => user.id === userId)) {
            await this.prisma.chat.delete({
                where: {
                    id: chatId
                }
            });
        }

        await this.socketGateway.handleDeleteChat(chatId, receiver.id, userId);

        return new Promise((resolve) => resolve({ status: 200, message: 'Chat deleted' }));
    }
}
