import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { usersProviders } from './users.providers';
import { DatabaseModule } from 'src/config/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/repositories/base/user.repository';
import { jwtConstants } from 'src/auth/auth.constants';


@Module({
    imports: [
      DatabaseModule,
      ConfigModule,
      JwtModule.register({
        global: true,
        secret: 'HELLO',
        signOptions: { expiresIn: '60' },
      })],
  controllers: [UsersController],
  providers: [UsersService, ...usersProviders, JwtModule, UserRepository,
  ],
  exports: [UsersService],

})
export class UsersModule { }
