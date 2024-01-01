import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFiles, Res, Req, UploadedFile } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { S3Client } from "@aws-sdk/client-s3";
import * as multerS3 from 'multer-s3'
import { query } from 'express';
import { get } from 'http';
import { log } from 'console';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  // this will add the product 

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 6 }]))
  createProduct(@Req() req: Request,
    @Res() res: Response,
    @Body() product: any,
    @UploadedFiles() files: Array<Express.Multer.File>,) {
    files = files['image']
    return this.productService.createProduct(product, files, res);
  }
  //to get all brand
  @Get('brand')
  findAll() {
    return this.productService.findAllBrand();
  }
  //this will add the brand 
  @Post('brand')
  createBrand(@Body() createProductDto: CreateProductDto) {
    return this.productService.createBrand(createProductDto);
  }
  //to get all category
  @Get('category')
  findAllcategory() {
    return this.productService.findAllcategory();
  }
  // this will add the category
  @Post('category')
  createCategory(@Body() createProductDto: CreateProductDto) {
    console.log(createProductDto);

    return this.productService.createCategory(createProductDto);
  }
  //to get all product
  @Get()
  findAllProduct() {
    return this.productService.findAllProduct();
  }
  //to get all productDetails
  @Get('productDetail')
  findAllProductDetail(@Query('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.findAllProductDetail(id);
  }

  //to get all brandDetails
  @Get('brandDetails')
  findAllbrandDetails(@Query('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.brandDetails(id);
  }
  @Get('categoryDetails')
  findcategoryDetails(@Query('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.categoryDetails(id);
  }
  // this will update the product 
  @Patch('id')
  productUpdate(@Query('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.productUpdate(id, updateProductDto);
  }
  // this will update the brand
  @Patch('brand/id')
  brandUpdate(@Query('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.brandUpdate(id, updateProductDto);
  }
  // this will update the category
  @Patch('category/id')
  categoryUpdate(@Query('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.categoryUpdate(id, updateProductDto);
  }


  @Get('BestSeller')
  BestSeller() {
    return this.productService.BestSeller();
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
  @Get('filter')
  filter(@Query() filter: CreateProductDto) {
    console.log(filter, 'this from filter get option');  
    console.log(filter.brand);
    if( Boolean(filter.brake_type)!=true||false){
      console.log('error');
      
    }
    console.log(filter.brake_type);
    console.log(filter.suspension);
    
    // return this.productService.filterProduct(filter)

  }

}
