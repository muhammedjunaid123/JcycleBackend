import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  

  const corsOptions: CorsOptions = {
    origin:  process.env.url,
    methods: 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
    allowedHeaders: 'Content-Type, X-Auth-Token, Origin, Authorization',
  };
  app.enableCors(corsOptions);

  await app.listen(3000);

}
bootstrap();
