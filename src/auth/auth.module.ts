import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { DatabaseModule } from 'src/config/database/database.module';
import { UserRepository } from 'src/repositories/base/user.repository';
import { UsersService } from 'src/users/users.service';
import { cartProviders, usersProviders, wishlistProviders } from 'src/users/users.providers';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { wishlistRepository } from 'src/repositories/base/wishlist.repository';
import { cartRepository } from 'src/repositories/base/cart.repository';
import { brandProviders, categoryProviders, productProviders } from 'src/product/product.providers';


@Module({
  imports: [UsersModule, DatabaseModule],
  controllers: [AuthController],
  providers: [AuthService, UsersService,
    UserRepository,
    ...usersProviders, JwtService,wishlistRepository,cartRepository,...wishlistProviders,...cartProviders,...productProviders,...brandProviders,...categoryProviders ]
})
export class AuthModule { }
