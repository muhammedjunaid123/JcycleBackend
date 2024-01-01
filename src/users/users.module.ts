import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { cartProviders, orderProviders, usersProviders, wishlistProviders } from './users.providers';
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


@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    JwtModule.register({
      global: true,
      secret: process.env.secret,
      signOptions: { expiresIn: '24hr' },
    })],
  controllers: [UsersController],
  providers: [UsersService, ...usersProviders, JwtModule, UserRepository, cartRepository, wishlistRepository,
     ...cartProviders, ...wishlistProviders, ...productProviders, ...brandProviders, ...categoryProviders,
     orderRepository,...orderProviders
  ],
  exports: [UsersService],

})
export class UsersModule { }
