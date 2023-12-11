import { Connection } from 'mongoose';
import { productSchema } from '../schemas/product.schema';
import { brandSchema } from 'src/schemas/brand.schema';
import { categorySchema } from 'src/schemas/category.schema';


export const productProviders = [
    {
        provide: 'PRODUCT_MODEL',
        useFactory: (connection: Connection) =>
            connection.model('product', productSchema),
        inject: ['DATABASE_CONNECTION'],
    },
];


export const brandProviders = [
    {
        provide: 'BRAND_MODEL',
        useFactory: (connection: Connection) =>
            connection.model('brand', brandSchema),
        inject: ['DATABASE_CONNECTION'],
    },
];

export const categoryProviders = [
    {
        provide: 'CATRGORY_MODEL',
        useFactory: (connection: Connection) =>
            connection.model('category', categorySchema),
        inject: ['DATABASE_CONNECTION'],
    },
];

