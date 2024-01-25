import { Connection } from 'mongoose';
import { chatSchema } from 'src/schemas/chat.schema';


export const chatProviders = [
  {
    provide: 'CHAT_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('chat',chatSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];