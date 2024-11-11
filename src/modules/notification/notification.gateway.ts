import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/notifications' })
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  sendNotification(data: any) {
    this.server.emit('notification', data);
  }

  @SubscribeMessage('client_notification')
  handleClientNotification(@MessageBody() data: any) {
    this.server.emit('notification', data);
  }
}
