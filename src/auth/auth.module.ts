import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { DatabaseModule } from 'src/config/database/database.module';
import { UserRepository } from 'src/repositories/base/user.repository';
import { UsersService } from 'src/users/users.service';
import { usersProviders } from 'src/users/users.providers';
import { JwtModule, JwtService } from '@nestjs/jwt';


@Module({
  imports: [UsersModule, DatabaseModule],
  controllers: [AuthController],
  providers: [AuthService, UsersService,
    UserRepository,
    ...usersProviders, JwtService]
})
export class AuthModule { }
