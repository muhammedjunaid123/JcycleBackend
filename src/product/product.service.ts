import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { productRepository } from 'src/repositories/base/product.repository';

@Injectable()
export class ProductService {
  constructor(private _productRepository: productRepository) { }
 async createProduct(createProductDto: CreateProductDto,res:Response) {
   return await  this._productRepository.createProduct(createProductDto,res)
  

  }


  createBrand(createProductDto: CreateProductDto) {
    console.log(createProductDto);
    
    return this._productRepository.createBrand(createProductDto)
  }
  createCategory(createProductDto: CreateProductDto) {
    return this._productRepository.createCategory(createProductDto)
  }
  findAllProduct(){
    return this._productRepository.findAllProduct()
  }
  findAllProductDetail(id:string){
    return this._productRepository.findProductDetails(id)
  }
  brandDetails(id:string){
    return this._productRepository.brandDetails(id)
  }
  categoryDetails(id:string){
    return this._productRepository.categoryDetails(id)
  }
  findAllBrand() {
   return this._productRepository.findAllBrand()
  }
  findAllcategory(){
    return this._productRepository.findAllcategory()
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  productUpdate(id: string, updateProductDto: UpdateProductDto) {
    return this._productRepository.productUpdate(id, updateProductDto)
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
 
}
