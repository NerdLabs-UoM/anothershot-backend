import { WebSocketServer, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageSendDto } from './chat/dto/message.dto';
import { Chat } from '@prisma/client';

@WebSocketGateway(8001, { cors: '*' })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  private connectedUsers: Map<string, Socket> = new Map();

  @SubscribeMessage('connect-user')
  handleConnection(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
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
    this.connectedUsers.delete(userId);
  }

//   ChatGateway

  handleSendMessage(dto: MessageSendDto) {
    const receiver = this.connectedUsers.get(dto.receiverId);
    if (receiver) {
      receiver.emit('receive-msg', dto);
    }
  }

  handleNewChat(chat: Chat, userId: string) {
    const receiver = this.connectedUsers.get(userId);
    if (receiver) {
      receiver.emit('new-chat', chat);
    }
  }

  handleDeleteChat(chatId: string, receiverId: string, userId: string) {
    const receiver = this.connectedUsers.get(receiverId);
    const sender = this.connectedUsers.get(userId);
    if (receiver) {
      receiver.emit('delete-chat', chatId);
    }
    if (sender) {
      sender.emit('delete-chat', chatId);
    }
  }

//  Notification Gateway
  
    handleNewNotification(userId: string, notification: any) {
      const receiver = this.connectedUsers.get(userId);
      if (receiver) {
        receiver.emit('new-notification', notification);
      }
    }
  
    handleDeleteNotification(userId: string, notificationId: string) {
      const receiver = this.connectedUsers.get(userId);
      if (receiver) {
        receiver.emit('delete-notification', notificationId);
      }
    }
  
          
}
