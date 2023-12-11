import { Connection } from 'mongoose';
import { adminSchema } from '../schemas/admin.schema';


export const  adminProviders = [
  {
    provide: 'ADMIN_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('admin', adminSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
