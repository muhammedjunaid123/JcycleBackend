import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { productRepository } from 'src/repositories/base/product.repository';
import { ImageService } from 'src/image/image.service';
import { ImageController } from 'src/image/image.controller';
import { rejects } from 'assert';
import { resolve } from 'path';
import { Response } from 'express';
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class ProductService {
  //
  constructor(private _productRepository: productRepository, private _image: ImageService) { }
  //

  async createProduct(createProductDto: any,
    files: Array<Express.Multer.File>,
    res: Response,) {
    const image = await this._image.upload(files);
    return await this._productRepository.createProduct(createProductDto, image, res)
  }
  createBrand(createProductDto: CreateProductDto) {
    console.log(createProductDto);

    return this._productRepository.createBrand(createProductDto)
  }
  createCategory(createProductDto: CreateProductDto) {
    return this._productRepository.createCategory(createProductDto)
  }
  findAllProduct(id: string) {   
    let data:any
    if (id=='null') {      
       data=null 
    } else {
       data = jwtDecode(id)
      data=data['token']
    }

    return this._productRepository.findAllProduct(data)
  }
  findAllProductDetail(id: string) {
    return this._productRepository.findProductDetails(id)
  }
  productDetailAdmin(id: string) {
    return this._productRepository.ProductDetails(id)
  }
  brandDetails(id: string) {
    return this._productRepository.brandDetails(id)
  }
  categoryDetails(id: string) {
    return this._productRepository.categoryDetails(id)
  }
  findAllBrand() {
    return this._productRepository.findAllBrand()
  }
  findAllcategory() {
    return this._productRepository.findAllcategory()
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  async productUpdate(id: string, updateProductDto: UpdateProductDto, files: Array<Express.Multer.File>, res: Response) {

    let image = []
    if (files !== undefined) {
      image = await this._image.upload(files);
    }

    return this._productRepository.productUpdate(id, updateProductDto, image, res)
  }

  brandUpdate(id: string, updateProductDto: UpdateProductDto) {
    return this._productRepository.brandUpdate(id, updateProductDto)
  }

  categoryUpdate(id: string, updateProductDto: UpdateProductDto) {
    return this._productRepository.categoryUpdate(id, updateProductDto)
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
  // give the bestSeller product
  BestSeller() {

    return this._productRepository.findBestSeller()


  }

  filterProduct(filter: CreateProductDto) {


    return this._productRepository.filter(filter)
  }
  imgDelete(index: number, id: string) {
    console.log('enter 2');

    return this._productRepository.imgDelete(index, id)
  }
}
