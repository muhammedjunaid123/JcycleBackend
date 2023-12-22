import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { productRepository } from 'src/repositories/base/product.repository';
import { brandProviders, categoryProviders, productProviders } from 'src/product/product.providers';
import { DatabaseModule } from 'src/config/database/database.module';
import { CloudinaryProvider } from './image.provider'

@Module({
  controllers: [ImageController],
  providers: [ImageService, CloudinaryProvider],
  exports:[ImageService,CloudinaryProvider]
})
export class ImageModule {}
