import { Inject, HttpException, HttpStatus } from "@nestjs/common";
import { CreateProductDto } from "../../product/dto/create-product.dto";
import { UpdateProductDto } from "src/product/dto/update-product.dto";
import { Product } from "../../product/entities/product.entity";
import { Model } from "mongoose";

export class productRepository {
    constructor(
        @Inject('PRODUCT_MODEL')
        private _productModel: Model<Product>,
        @Inject('BRAND_MODEL')
        private _brandModel: Model<Product>,
        @Inject('CATRGORY_MODEL')
        private _categoryModel: Model<Product>,
    ) { }
    //for create brand 
    async createBrand(brandName: CreateProductDto){
        const { name } = brandName;

        // Check if the brand with the given name already exists
        const existingBrand = await this._brandModel.findOne({ Brand_name: name });

        if (existingBrand) {
            throw new HttpException(
                `Brand with name '${name}' already exists.`,
                HttpStatus.BAD_REQUEST,
              );
         
        }

        // If the brand doesn't exist, create a new one
        const brand = new this._brandModel({
            Brand_name: name
        });

        // Save the new brand to the database
        return await brand.save();
    }
    // create category 
    async createCategory(categoryName: CreateProductDto) {
        const { name } = categoryName

        const existingBrand = await this._categoryModel.findOne({ category_name: name });

        if (existingBrand) {
            throw new HttpException(
                `category with name '${name}' already exists.`,
                HttpStatus.BAD_REQUEST,
              );
         
        }

        const category = new this._categoryModel({
            category_name: name
        })
        return await category.save();
    }

    // create the product 
    async createProduct(productData: CreateProductDto,res) {
        console.log(productData);
         
        const { name, brake_type, brand, category, cycle_Details, gears, price, stock, suspension } = productData

        const product = new this._productModel({
            name: name,
            brake_type: brake_type,
            brand: brand,
            category: category,
            cycle_Details: cycle_Details,
            gears: gears,
            price: price,
            stock: stock,
            suspension: suspension,
          
        })
        await product.save();
        return res.status(HttpStatus.CREATED).json({
  
        });
        
    }
    //update the product 
    async productUpdate(id: string, UpdateProduct: UpdateProductDto) {
        const { name, brake_type, brand, category, cycle_Details, gears, price, stock, suspension } = UpdateProduct
        console.log(id);
        
        return await this._productModel.findByIdAndUpdate({ _id: id }, {
            $set: {
                name: name,
                brake_type: brake_type,
                brand: brand,
                category: category,
                cycle_Details: cycle_Details,
                gears: gears,
                price: price,
                stock: stock,
                suspension: suspension,
               
            }
        })
    }
    //update the brand
    async brandUpdate(id: string, UpdateBrand: UpdateProductDto) {
        const { name } = UpdateBrand
        return await this._brandModel.findByIdAndUpdate({ _id: id }, {
            $set: {
                Brand_name: name
            }
        })
    }

    async categoryUpdate(id: string, Updatecategory: UpdateProductDto) {
        const { name } = Updatecategory
        return await this._categoryModel.findByIdAndUpdate({ _id: id }, {
            $set: {
                category_name: name
            }
        })


    }

   async findAllBrand(){
        return await this._brandModel.find()
    }
    async findAllcategory(){
        return await this._categoryModel.find()
    }
async findAllProduct(){
    return await this._productModel.find()
}
async findProductDetails(id:string){
    
    return await this._productModel.findById({_id:id})
}

async brandDetails(id:string){
    return await this._brandModel.findById({_id:id})
}
// to block or unblock the product
async productBlock_and_unblock(id:string,productData:UpdateProductDto){
    const {isBlocked}=productData
    return await this._productModel.findByIdAndUpdate({_id:id},{$set:{isBlocked:isBlocked}})   
  }

  // to block or unblock the category
  async categoryblock(id:string,productData:UpdateProductDto){
    
     const {isBlocked}=productData
    return await this._categoryModel.findByIdAndUpdate({_id:id},{$set:{isBlocked:isBlocked}})
  }

  // to block or unblock the brand
  async brandBlock(id:string,brandData:UpdateProductDto){
      console.log(brandData);
    const {isBlocked}=brandData
    
    return await this._brandModel.findByIdAndUpdate({_id:id},{$set:{isBlocked:isBlocked}})
  }
  async categoryDetails(id:string){
    return await this._categoryModel.findById({_id:id})
}
}