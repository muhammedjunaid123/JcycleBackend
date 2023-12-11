import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const corsOptions: CorsOptions = {
    origin:'http://localhost:4200',
    credentials: true,
  };  
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });
  
  await app.listen(3000);

} 
bootstrap();
