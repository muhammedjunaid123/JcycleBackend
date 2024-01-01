import { Inject } from "@nestjs/common";
import { Model } from "mongoose";

export class orderRepository {
    constructor(
        @Inject('ORDER_MODEL')
        private _orderModel: Model<any>,
        @Inject('CART_MODEL')
        private _cartModel: Model<any>,
    ) { }
    async addOrder(user: string, razorId: any, paymentMethod: any) {

        const cartdata = await this._cartModel.findOne({ user: user })
        const product: any[] = cartdata['product']
        const exist = await this._orderModel.findOne({ user: user })
        if (exist) {

            return await this._orderModel.findOneAndUpdate({ user: user }, { $push: { product: product } })

        } else {
            const data = new this._orderModel({
                user: user,
                product: product,

            })
            return await data.save()
        }

    }
   async loadOrder(user:string){
        return await this._orderModel.find().populate('product.id').populate('user')
    }

    async orderStatusUpdate(user:string,orderID:string,value:string){
       return await this._orderModel.findOneAndUpdate({user:user,'product._id':orderID},{$set:{  'product.$.status': value}})
    }

}