import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as dotenv from 'dotenv';
import { ChatDto } from './dto/create-chat.dto';
import { ChatService } from './chat.service';

dotenv.config();
@WebSocketGateway({
  cors: {
    origin:  process.env.url,
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'X-Auth-Token', 'Origin', 'Authorization'],

  },

})
export class ChatGateway {
  @WebSocketServer()
  server: Server;
  constructor(private _chatService: ChatService) { }


  @SubscribeMessage('disconnect')
  handleDisconnection(client: Socket, roomName: any) {
    client.leave(roomName.name);
  }
  @SubscribeMessage('join')
  async handleJoinEvent(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomName: any,
  ) {

    client.join(roomName.Roomid);
    client.broadcast.to(roomName.Roomid).emit('member-joined');
  }
  @SubscribeMessage('new-message')
  async handleNewMessage(@MessageBody() data: ChatDto): Promise<void> {
    const newMessage = await this._chatService.newMessage(data);
    this.server.to(data.id).emit('new-message', newMessage);
  }
}