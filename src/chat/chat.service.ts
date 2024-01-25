import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ChatDto } from './dto/create-chat.dto';
import { ChatRepository } from 'src/repositories/base/chat.repository';


@Injectable()
export class ChatService {
  constructor(private _chatRepository: ChatRepository) {}
  async newMessage(data: ChatDto) {
    try {
      await this._chatRepository.newMessage(data);
      return await this._chatRepository.findMessage(data.id);
   
    } catch (error) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }  
}
