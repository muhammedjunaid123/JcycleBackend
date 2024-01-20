import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { adminProviders} from "./admin.providers"
import { AdminRepository } from 'src/repositories/base/admin.repository';
import { DatabaseModule } from 'src/config/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { productRepository } from 'src/repositories/base/product.repository';
import { UserRepository } from 'src/repositories/base/user.repository';
import { rentOrderProviders, rentProviders, reviewProviders, usersProviders } from 'src/users/users.providers';
import { brandProviders, categoryProviders, productProviders } from 'src/product/product.providers';
import { reviewRepository } from 'src/repositories/base/review.repository';
import { rentRepository } from 'src/repositories/base/rent.repository';
 
@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    JwtModule.register({
      global: true,
      secret: process.env.secret,
      signOptions: { expiresIn:'2 days'},
    })],
  controllers: [AdminController],
  providers: [AdminService,...adminProviders,AdminRepository,JwtModule,productRepository,UserRepository,...usersProviders,...productProviders,...brandProviders,...categoryProviders,...reviewProviders,reviewRepository,rentRepository,...rentProviders,...rentOrderProviders  ],
  exports:[AdminService]
})
export class AdminModule {}
