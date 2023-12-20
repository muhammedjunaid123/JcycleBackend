import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { log } from "console";
import { Model } from "mongoose";
import { Product } from "src/product/entities/product.entity";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User } from "src/users/entities/user.entity";

export class wishlistRepository {
  constructor(
    @Inject('WISHLIST_MODEL')
    private _wishlistModel: Model<any>,
    @Inject('PRODUCT_MODEL')
    private _productModel: Model<Product>,
  ) { }

  async addWishlist(id: string, user: string) {
    const exist = await this._wishlistModel.findOne({ user: user })
    if (exist) {
     const existProduct=await this._wishlistModel.findOne({ user: user,'product.id': id })
     if(existProduct){
      await this._productModel.findByIdAndUpdate({_id:id},{$set:{wished:false}},{upsert:true})
      return await this._wishlistModel.findOneAndUpdate({ user: user }, {$pull: { product: { id: id } } })
     }else{
     await this._productModel.findByIdAndUpdate({_id:id},{$set:{wished:true}})
      return await this._wishlistModel.findOneAndUpdate({ user: user }, { $push: { product: { id: id } } })
     }
    } 
   const data1= await this._productModel.findByIdAndUpdate({_id:id},{$set:{wished:true}})
   console.log(data1);
   
     const data = new this._wishlistModel({
      user: user,
      product: [
        {
          id: id,
        }

      ]
    })
    return await data.save()
  }

  Wishlist(id:string){
   
    try {
      return this._wishlistModel.findOne({user:id}).populate('product.id')
    } catch (error) {
      console.log(error);
      
    }
  }
}