import { Connection } from "mongoose";
import { ServicerSchema } from "src/schemas/servicer.schema";



export const ServicerProviders = [
    {
      provide: 'SERVICER_MODEL',
      useFactory: (connection: Connection) =>
        connection.model('servicer', ServicerSchema),
      inject: ['DATABASE_CONNECTION'],
    },
  ];
  