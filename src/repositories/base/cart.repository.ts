import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { Model } from "mongoose";
import { CreateUserDto } from "src/users/dto/create-user.dto";


export class cartRepository {
    constructor(
      @Inject('CART_MODEL')
      private _cartModel: Model<any>,
    ) { }

    async cart(id:string){
      
    try {
      return this._cartModel.findOne({user:id}).populate('product.id')
    } catch (error) {
      console.log(error);
      
    }
    }

   async  addCart(id:string,user:string){
       
        const exist= await this._cartModel.findOne({user:user})
        if(exist){
             const existProduct= await this._cartModel.findOne({user:user,'product.id':id})
             if(existProduct){
              throw new HttpException (
                'already added',
                HttpStatus.FOUND
              )
             }else{
            return   await this._cartModel.findOneAndUpdate({ user: user }, { $push: { product: { id: id, count:1 } } })
             }
        }else{

      
        const data=new this._cartModel({
        user:user,
        product:[
       {
        id:id,
        count:1
       }

        ]
        })
      return await data.save()
        }
    }
   async cartRemove(id:string,user:string){
    const exist= await this._cartModel.findOne({user:user})
    if(exist){
     return   await this._cartModel.findOneAndUpdate({ user: user }, { $pull: { product: { id: id} } })
      
    }
    }
}