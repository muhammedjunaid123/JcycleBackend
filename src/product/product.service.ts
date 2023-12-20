import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { productRepository } from 'src/repositories/base/product.repository';
import { ImageService } from 'src/image/image.service';
import { ImageController } from 'src/image/image.controller';
import { rejects } from 'assert';
import { resolve } from 'path';

@Injectable()
export class ProductService {
  constructor(private _productRepository: productRepository,private _jwts3:ImageService) { }

 async createProduct(createProductDto: any,  files: Array<Express.Multer.File>,res:Response,) {
     
   const img=[]  
const image= await files.forEach((file)=>{
  let promise=new Promise((resolve,reject)=>{
    
   const data= this._jwts3.upload(file.originalname,file.buffer);
   if(data!==null){
     

     resolve(data)
   }
  })
  promise.then((res)=>{
    
    
    img.push(res)
  })
  
})
console.log("img");
 console.log(img);
 console.log("image");
 console.log(image);
 
 
   return await  this._productRepository.createProduct(createProductDto,img,res)
  

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
// give the bestSeller product
  BestSeller(){
  
    return this._productRepository.findBestSeller()
   
   
  }

  filterProduct(filter:CreateProductDto){
    return this._productRepository.filter(filter)
  }
 
}
