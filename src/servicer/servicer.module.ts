import { Module } from '@nestjs/common';
import { ServicerService } from './servicer.service';
import { ServicerController } from './servicer.controller';
import { servicerRepository } from 'src/repositories/base/servicers.repository';
import { ServicerProviders } from './servicer.providers';
import { DatabaseModule } from 'src/config/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[DatabaseModule,
    ConfigModule,
    JwtModule.register({
      global: true,
      secret: process.env.secret,
      signOptions: { expiresIn: '2 days' },
    }),],
  controllers: [ServicerController],
  providers: [ServicerService,servicerRepository,...ServicerProviders,JwtModule],
})
export class ServicerModule {}
