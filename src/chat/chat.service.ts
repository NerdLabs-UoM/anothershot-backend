// ChatService

import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatCreateDto } from './dto/chat.dto';
import { MessageSendDto } from './dto/message.dto';
import { AppGateway } from 'src/app.gateway';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private prisma: PrismaService,
    private socketGateway: AppGateway
  ) { }

  // Create a new chat
  async create(dto: ChatCreateDto) {
    this.logger.log(`Creating chat between sender: ${dto.senderId} and receiver: ${dto.receiverId}`);
    try {
      const existingChat = await this.prisma.chat.findFirst({
        where: {
          users: {
            every: {
              id: {
                in: [dto.senderId, dto.receiverId],
              },
            },
          },
        },
      });

      if (existingChat) {
        this.logger.error('Chat creation failed: Chat already exists');
        throw new BadRequestException('Chat already exists');
      }

      const res = await this.prisma.chat.create({
        data: {
          messages: {
            create: {
              message: 'Hello...',
              sender: {
                connect: {
                  id: dto.senderId,
                },
              },
              receiver: {
                connect: {
                  id: dto.receiverId,
                },
              },
            },
          },
          users: {
            connect: [
              { id: dto.senderId },
              { id: dto.receiverId },
            ],
          },
        },
        include: {
          users: true,
          messages: {
            include: {
              sender: true,
              receiver: true,
              attachments: true,
            },
          },
        },
      });

      await this.socketGateway.handleNewChat(res, dto.receiverId);

      return res;
    } catch (error) {
      this.logger.error(`Chat creation failed: ${error.message}`, error.stack);
      throw new BadRequestException(error.message);
    }
  }

  // Get chats by user ID
  async getChatsByUserId(userId: string) {
    this.logger.log(`Fetching chats for user ID: ${userId}`);
    try {
      return await this.prisma.chat.findMany({
        where: {
          users: {
            some: {
              id: userId,
            },
          },
        },
        include: {
          users: true,
          messages: {
            include: {
              sender: true,
              receiver: true,
              attachments: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(`Fetching chats failed: ${error.message}`, error.stack);
      throw new BadRequestException(error.message);
    }
  }

  // Get chat by chat ID
  async getChatsByChatId(chatId: string) {
    this.logger.log(`Fetching chat for chat ID: ${chatId}`);
    try {
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
              attachments: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(`Fetching chat failed: ${error.message}`, error.stack);
      throw new BadRequestException(error.message);
    }
  }

  // Send a message
  async sendMessage(dto: MessageSendDto) {
    this.logger.log(`Sending message from ${dto.senderId} to ${dto.receiverId}`);
    try {
      const message = await this.prisma.message.create({
        data: {
          message: dto.message,
          chat: {
            connect: {
              id: dto.chatId,
            },
          },
          sender: {
            connect: {
              id: dto.senderId,
            },
          },
          receiver: {
            connect: {
              id: dto.receiverId,
            },
          },
          attachments: {
            create: dto.attachments,
          },
        },
        include: {
          sender: true,
          receiver: true,
          attachments: true,
        },
      });

      await this.socketGateway.handleSendMessage(dto);

      return message;
    } catch (error) {
      this.logger.error(`Sending message failed: ${error.message}`, error.stack);
      throw new BadRequestException(error.message);
    }
  }

  // Delete a chat
  async deleteChat(userId: string, chatId: string) {
    this.logger.log(`Deleting chat with ID: ${chatId} for user ID: ${userId}`);
    try {
      const chat = await this.prisma.chat.findUnique({
        where: {
          id: chatId,
        },
        include: {
          users: true,
        },
      });

      const receiver = chat.users.find(user => user.id !== userId);

      if (chat.users.some(user => user.id === userId)) {
        await this.prisma.chat.delete({
          where: {
            id: chatId,
          },
        });
      }

      await this.socketGateway.handleDeleteChat(chatId, receiver.id, userId);

      return { status: 200, message: 'Chat deleted' };
    } catch (error) {
      this.logger.error(`Deleting chat failed: ${error.message}`, error.stack);
      throw new BadRequestException(error.message);
    }
  }
}
