import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFiles, Res, Req, UploadedFile } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { S3Client } from "@aws-sdk/client-s3";
import * as multerS3 from 'multer-s3'

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }
  // this will add the product 
  @Post()
  // @UseInterceptors( 
  //   FileInterceptor('image'))
  //   uploadFile(@UploadedFile() image:Express.Multer.File){
  //  console.log(image);
   
  //   }
  
  createProduct(@Body() createProductDto: CreateProductDto,@Res() res: Response) {
   
   
    return this.productService.createProduct(createProductDto,res);
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

    console.log(updateProductDto);
    console.log(id);
    
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


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
  

}
