import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { DatabaseModule } from 'src/config/database/database.module';
import { chatProviders } from './chatProviders';
import { ChatRepository } from 'src/repositories/base/chat.repository';
import { usersProviders } from 'src/users/users.providers';
import { ServicerProviders } from 'src/servicer/servicer.providers';

@Module({
  imports:[DatabaseModule],
  providers: [ChatService, ChatGateway,...chatProviders,ChatRepository,...usersProviders,...ServicerProviders],
})
export class ChatModule {}
