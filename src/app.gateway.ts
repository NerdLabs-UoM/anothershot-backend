// AppGateway

import {
  WebSocketServer,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { MessageSendDto } from './chat/dto/message.dto';
import { Chat } from '@prisma/client';
import { SendNotifyDto } from './notification/dto/create-notify.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(AppGateway.name);

  @WebSocketServer()
  server: Server;

  private connectedUsers: Map<string, Socket> = new Map();

  @SubscribeMessage('connect-user')
  handleConnection(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket
  ) {
    this.logger.log(`User connected: ${userId}`);
    const isConnected = this.connectedUsers.get(userId);
    if (isConnected === client) {
      return;
    }
    if (isConnected !== client) {
      if (userId !== 'undefined') {
        this.connectedUsers.set(userId, client);
      }
    }
  }

  @SubscribeMessage('disconnect-user')
  handleDisconnect(@MessageBody() userId: string) {
    this.logger.log(`User disconnected: ${userId}`);
    this.connectedUsers.delete(userId);
  }

  // ChatGateway

  handleSendMessage(dto: MessageSendDto) {
    this.logger.log(
      `Sending message from ${dto.senderId} to ${dto.receiverId}`
    );
    const receiver = this.connectedUsers.get(dto.receiverId);
    if (receiver) {
      receiver.emit('receive-msg', dto);
    }
  }

  handleNewChat(chat: Chat, userId: string) {
    this.logger.log(`New chat for user: ${userId}`);
    const receiver = this.connectedUsers.get(userId);
    if (receiver) {
      receiver.emit('new-chat', chat);
    }
  }

  handleDeleteChat(chatId: string, receiverId: string, userId: string) {
    this.logger.log(
      `Deleting chat ${chatId} for users: ${receiverId} and ${userId}`
    );
    const receiver = this.connectedUsers.get(receiverId);
    const sender = this.connectedUsers.get(userId);
    if (receiver) {
      receiver.emit('delete-chat', chatId);
    }
    if (sender) {
      sender.emit('delete-chat', chatId);
    }
  }

  // Notification Gateway

  handleNewNotification(notify: SendNotifyDto) {
    this.logger.log(`New notification for user: ${notify.receiverId}`);
    const receiver = this.connectedUsers.get(notify.receiverId);
    if (receiver) {
      receiver.emit('receive-notify', notify);
    }
  }
}
