import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { Model } from "mongoose";
import { ChatDto } from "src/chat/dto/create-chat.dto";

export class ChatRepository {
    constructor(
        @Inject('CHAT_MODEL')
        private _chatModel: Model<any>,
    ){}

    async newMessage(data: ChatDto): Promise<any> {
      try {
      
        await this._chatModel.updateOne(
          { _id: data.id },
          {
            $push: {
              messages: {
                text: data.data,
                sender: data.userId,
                time: new Date(),
                receiver: data.servicerId,
                senderType: data.senderType,
                receiverType: data.receiverType,
              },
            },
          },
        );
      } catch (error) {
        throw new HttpException(
          'there is some issue please try again later',
          HttpStatus.BAD_REQUEST
         )
      }
      }
      async findMessage(id: string): Promise<any> {
        try {
          
          return await this._chatModel
          .findOne({ _id: id })
          .populate('messages.sender')
          .populate('messages.receiver');
        } catch (error) {
          throw new HttpException(
            'there is some issue please try again later',
            HttpStatus.BAD_REQUEST
           ) 
        }
        }
    
}