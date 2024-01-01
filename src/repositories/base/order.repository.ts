import { Inject } from "@nestjs/common";
import { Model } from "mongoose";
import { User } from "src/users/entities/user.entity";

export class orderRepository {
    constructor(
        @Inject('ORDER_MODEL')
        private _orderModel: Model<any>,
        @Inject('CART_MODEL')
        private _cartModel: Model<any>,
        @Inject('USER_MODEL')
        private _userModel: Model<User>,
    ) { }
    async addOrder(user: string, razorId: any, paymentMethod: any) {

        const cartdata = await this._cartModel.findOne({ user: user })
        const product: any[] = cartdata['product']
        const exist = await this._orderModel.findOne({ user: user })
        let data1:any
        if (exist) {

            data1=await this._orderModel.findOneAndUpdate({ user: user }, { $push: { product: product } })

        } else {
            const data = new this._orderModel({
                user: user,
                product: product,

            })
         data1 = await data.save()
        }
            
     const res= await this._cartModel.findOneAndDelete({user:user})
    
     
        return data1
    }
    async loadOrder(user: string) {
        return await this._orderModel.find().populate('product.id').populate('user')
    }

    async orderStatusUpdate(user: string, orderID: string, value: string,Total:number) {
      
        if(value==='return'){
        const data= await this._userModel.findByIdAndUpdate({_id:user},{$inc:{wallet:Total},$push: {
                walletHistory: {
                  date: new Date(),
                  amount: Total,
                  description: `Refunded for order Return - Order ${orderID}`,
                },
              },})
            
              
        }
      
        
        
        return await this._orderModel.findOneAndUpdate({ user: user, 'product._id': orderID }, { $set: { 'product.$.status': value } })
    }

}