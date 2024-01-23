import { Connection } from "mongoose";
import { serviceSchema } from "src/schemas/service.schema";
import { serviceOrderSchema } from "src/schemas/serviceOrder.schema";
import { ServicerSchema } from "src/schemas/servicer.schema";



export const ServicerProviders = [
    {
      provide: 'SERVICER_MODEL',
      useFactory: (connection: Connection) =>
        connection.model('servicer', ServicerSchema),
      inject: ['DATABASE_CONNECTION'],
    },
  ];
  
  export const ServiceProviders=[
    {
      provide: 'SERVICE_MODEL',
      useFactory: (connection: Connection) =>
        connection.model('service', serviceSchema),
      inject: ['DATABASE_CONNECTION'],
    }
  ]

  
export const serviceOrderProviders = [
  {
    provide: 'SERVICEORDER_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('serviceOrder', serviceOrderSchema),
    inject: ['DATABASE_CONNECTION'],
  }
]