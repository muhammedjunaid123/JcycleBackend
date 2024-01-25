import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { Model } from "mongoose";
import { User, order } from "src/users/entities/user.entity";
import { IOrderRepository } from "../interfaces/order-repostiory.interface";

export class orderRepository implements IOrderRepository {
    constructor(
        @Inject('ORDER_MODEL')
        private _orderModel: Model<any>,
        @Inject('CART_MODEL')
        private _cartModel: Model<any>,
        @Inject('USER_MODEL')
        private _userModel: Model<User>,
    ) { }
    async addOrder(user: string, razorId: any, paymentMethod: any): Promise<order> {
        try {
            const cartdata = await this._cartModel.findOne({ user: user })
            const product: any[] = cartdata['product']
            const exist = await this._orderModel.findOne({ user: user })
            let data1: any
            if (exist) {

                data1 = await this._orderModel.findOneAndUpdate({ user: user }, { $push: { product: product } })

            } else {
                const data = new this._orderModel({
                    user: user,
                    product: product,

                })
                data1 = await data.save()

            }

            const res = await this._cartModel.findOneAndDelete({ user: user })


            return data1
        } catch (error) {
            throw new HttpException(
                'there is some issue please try again later',
                HttpStatus.BAD_REQUEST
               )
        }
    }
    async loadOrder(user: string): Promise<order[]> {
        try {


            return await this._orderModel.find().populate('product.id').populate('user');
        } catch (error) {
            throw new HttpException(
                'there is some issue please try again later',
                HttpStatus.BAD_REQUEST
               )
        }
    }

    async orderStatusUpdate(user: string, orderID: string, value: string, Total: number): Promise<order> {
        try {


            if (value === 'return') {
                const data = await this._userModel.findByIdAndUpdate({ _id: user }, {
                    $inc: { wallet: Total }, $push: {
                        walletHistory: {
                            date: new Date(),
                            amount: Total,
                            description: `Refunded for order Return - Order ${orderID}`,
                        },
                    },
                })


            }
            if (value === 'cancelled') {
                const data = await this._userModel.findByIdAndUpdate({ _id: user }, {
                    $inc: { wallet: Total }, $push: {
                        walletHistory: {
                            date: new Date(),
                            amount: Total,
                            description: `Refunded for order cancelled - Order ${orderID}`,
                        },
                    },
                })


            }



            return await this._orderModel.findOneAndUpdate({ user: user, 'product._id': orderID }, { $set: { 'product.$.status': value } })
        } catch (error) {
            throw new HttpException(
                'there is some issue please try again later',
                HttpStatus.BAD_REQUEST
               )
        }
    }

}