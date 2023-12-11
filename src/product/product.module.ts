import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { brandProviders, categoryProviders, productProviders } from './product.providers';
import { DatabaseModule } from 'src/config/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { productRepository } from 'src/repositories/base/product.repository';

@Module({
  imports:[ 
    DatabaseModule,
    ConfigModule,
  ] ,
  controllers: [ProductController],
  providers: [ProductService,...productProviders,...brandProviders,...categoryProviders,productRepository],
})
export class ProductModule {}
