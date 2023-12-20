import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { productRepository } from 'src/repositories/base/product.repository';
import { brandProviders, categoryProviders, productProviders } from 'src/product/product.providers';
import { DatabaseModule } from 'src/config/database/database.module';

@Module({
  controllers: [ImageController],
  providers: [ImageService],
  exports:[ImageService]
})
export class ImageModule {}
