import { Connection } from 'mongoose';
import { UserSchema } from '../schemas/users.schema';
import { cartSchema } from 'src/schemas/cart.schema';
import { wishlistSchema } from 'src/schemas/wishlist.schema';
import { orderSchema } from 'src/schemas/order.schema';
import { ratings_reviewSchema } from 'src/schemas/ratings-review.schema';
import { rentSchema } from 'src/schemas/rent.schema';
import { addressSchema } from 'src/schemas/address.schema';
import { rentOrderSchema } from 'src/schemas/rent-order.schema';
import { locationSchema } from 'src/schemas/location.schema';
import { serviceOrderSchema } from 'src/schemas/serviceOrder.schema';
import { Rentratings_reviewSchema } from 'src/schemas/rent-review.schema';


export const usersProviders = [
  {
    provide: 'USER_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('User', UserSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];


export const cartProviders = [
  {
    provide: 'CART_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('cart', cartSchema),
    inject: ['DATABASE_CONNECTION'],
  },

];


export const wishlistProviders = [
  {
    provide: 'WISHLIST_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('wishlist', wishlistSchema),
    inject: ['DATABASE_CONNECTION'],
  },
]


export const orderProviders = [
  {
    provide: 'ORDER_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('order', orderSchema),
    inject: ['DATABASE_CONNECTION'],
  },
]

export const reviewProviders = [
  {
    provide: 'REVIEW_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('review', ratings_reviewSchema),
    inject: ['DATABASE_CONNECTION'],
  },
]
export const RENTreviewProviders = [
  {
    provide: 'RENTREVIEW_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Rentreview', Rentratings_reviewSchema),
    inject: ['DATABASE_CONNECTION'],
  },
]
export const rentProviders = [
  {
    provide: 'RENT_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('rent', rentSchema),
    inject: ['DATABASE_CONNECTION'],
  },
]

export const addressProviders = [
  {
    provide: 'ADDRESS_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('address', addressSchema),
    inject: ['DATABASE_CONNECTION'],
  },
]

export const rentOrderProviders = [
  {
    provide: 'RENT_ORDER_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('rentOrder', rentOrderSchema),
    inject: ['DATABASE_CONNECTION'],
  }
]

export const locationProviders = [
  {
    
    provide: 'LOCATION_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('location', locationSchema),
    inject: ['DATABASE_CONNECTION'],
  }
]


