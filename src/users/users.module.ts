import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RENTreviewProviders, addressProviders, cartProviders, locationProviders, orderProviders, rentOrderProviders, rentProviders, reviewProviders, usersProviders, wishlistProviders } from './users.providers';
import { DatabaseModule } from 'src/config/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/repositories/base/user.repository';
import { jwtConstants } from 'src/auth/auth.constants';
import { cartRepository } from 'src/repositories/base/cart.repository';
import { wishlistRepository } from 'src/repositories/base/wishlist.repository';
import { brandProviders, categoryProviders, productProviders } from 'src/product/product.providers';
import { productRepository } from 'src/repositories/base/product.repository';
import { orderRepository } from 'src/repositories/base/order.repository';
import { reviewRepository } from 'src/repositories/base/review.repository';
import { rentRepository } from 'src/repositories/base/rent.repository';
import { ImageService } from 'src/image/image.service';
import { addressRepository } from 'src/repositories/base/address.repository';
import { AuthModule } from 'src/auth/auth.module';
import { locationRepository } from 'src/repositories/base/location.repository';
import { servicerRepository } from 'src/repositories/base/servicers.repository';
import { ServiceProviders, ServicerProviders,serviceOrderProviders } from 'src/servicer/servicer.providers';
import { chatProviders } from 'src/chat/chatProviders';


@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    JwtModule.register({
      global: true,
      secret: process.env.secret,
      signOptions: { expiresIn: '2 days' },
    }),

  ],
  controllers: [UsersController],
  providers: [UsersService, ...usersProviders, JwtModule, UserRepository, cartRepository, wishlistRepository,
    ...cartProviders, ...wishlistProviders, ...productProviders, ...brandProviders, ...categoryProviders,
    orderRepository, ...orderProviders, ...reviewProviders, reviewRepository, ...rentProviders, rentRepository, ImageService,
    ...addressProviders, addressRepository, ...rentOrderProviders, ...locationProviders, locationRepository,...ServicerProviders,
    servicerRepository,...ServiceProviders,...serviceOrderProviders,...RENTreviewProviders,...chatProviders
  ],
  exports: [UsersService, JwtModule],

})
export class UsersModule { }
