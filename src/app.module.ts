import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { ProductModule } from './product/product.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ImageModule } from './image/image.module';


@Module({
  imports: [
    UsersModule, 
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        service: 'Gmail',
        secure: true,
        auth: {
          user: process.env.DEV_MAIL,
          pass: process.env.DEV_PASS,
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@localhost>',
      },
      preview: true,
    }),
     AuthModule, 
     AdminModule,
      ProductModule,
      ImageModule,
  ]
,  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
