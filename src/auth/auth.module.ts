import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { DatabaseModule } from 'src/config/database/database.module';
import { UserRepository } from 'src/repositories/base/user.repository';
import { UsersService } from 'src/users/users.service';
import { RENTreviewProviders, addressProviders, cartProviders, locationProviders, orderProviders, rentOrderProviders, rentProviders, reviewProviders, usersProviders, wishlistProviders } from 'src/users/users.providers';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { wishlistRepository } from 'src/repositories/base/wishlist.repository';
import { cartRepository } from 'src/repositories/base/cart.repository';
import { brandProviders, categoryProviders, productProviders } from 'src/product/product.providers';
import { orderRepository } from 'src/repositories/base/order.repository';
import { reviewRepository } from 'src/repositories/base/review.repository';
import { rentRepository } from 'src/repositories/base/rent.repository';
import { ImageService } from 'src/image/image.service';
import { addressRepository } from 'src/repositories/base/address.repository';
import { ConfigModule } from '@nestjs/config';
import { locationRepository } from 'src/repositories/base/location.repository';
import { ServiceProviders, ServicerProviders,serviceOrderProviders } from 'src/servicer/servicer.providers';
import { servicerRepository } from 'src/repositories/base/servicers.repository';
import { chatProviders } from 'src/chat/chatProviders';


@Module({
  imports: [UsersModule, DatabaseModule,ConfigModule],
  controllers: [AuthController],
  providers: [AuthService, UsersService,
    UserRepository,
    ...usersProviders,JwtService,wishlistRepository,cartRepository,...wishlistProviders,
    ...cartProviders,...productProviders,...brandProviders,...categoryProviders,
    orderRepository,...orderProviders,...reviewProviders,reviewRepository,rentRepository,...rentProviders,ImageService,...addressProviders,addressRepository,
    ...rentOrderProviders,...locationProviders,locationRepository, servicerRepository,...ServicerProviders,...ServiceProviders,
    ...serviceOrderProviders,...RENTreviewProviders,...chatProviders
  ]
})
export class AuthModule { }
