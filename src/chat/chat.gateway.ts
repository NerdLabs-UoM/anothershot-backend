import { WebSocketServer, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageSendDto } from './dto/message.dto';

@WebSocketGateway(8001, { cors: '*' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  private connectedUsers: Map<string, Socket> = new Map();

  @SubscribeMessage('connect-user')
  handleConnection(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    const isConnected = this.connectedUsers.get(userId);
    if (!isConnected) {
      if (userId !== 'undefined') {
        this.connectedUsers.set(userId, client);
      }
    }
  }

  @SubscribeMessage('disconnect-user')
  handleDisconnect(@MessageBody() userId: string) {
    this.connectedUsers.delete(userId);
  }

  handleSendMessage(dto: MessageSendDto) {
    const receiver = this.connectedUsers.get(dto.receiverId);
    if (receiver) {
      receiver.emit('receive-msg', dto);
    }
  }
}
