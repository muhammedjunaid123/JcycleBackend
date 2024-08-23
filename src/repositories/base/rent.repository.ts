import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { log } from "console";
import { jwtDecode } from "jwt-decode";
import { Model } from "mongoose";
import { User, rent, rentorderDetails } from "src/users/entities/user.entity";
import { format } from 'date-fns-tz';
import { promises } from "dns";
import { IRentRepository } from "../interfaces/rent-repostitory.interface";
import { servicer } from "src/servicer/servicers.type";

export class rentRepository implements IRentRepository {
  constructor(
    @Inject('RENT_MODEL')
    private _rentModel: Model<rent>,
    @Inject('RENT_ORDER_MODEL')
    private _rentOrderModel: Model<any>,
    @Inject('USER_MODEL')
    private _userModel: Model<User>,
    @Inject('RENTREVIEW_MODEL')
    private _reviewRentModel: Model<any>
  ) { }
  async addrent(img: any, rent_data: rent, user: string): Promise<rent> {
    try {
      const image = []
      for (let f of img) {
        image.push(f.secure_url)
      }
      const { name, cycle_Details, location, price } = rent_data
      const rent = new this._rentModel({
        name: name,
        cycle_Details: cycle_Details,
        location: location,
        owner: user,
        price: price,
        image: image
      })
      return await rent.save()



    } catch (error) {
      throw new HttpException(
        'there is some issue please try again later',
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async loadRentBicycle(data: any): Promise<rent[]> {
    try {

      let { start, end, location } = data;
      start = new Date(start)
      end = new Date(end)




      const dataa = await this._rentModel.aggregate([
        {
          $lookup: {
            from: 'rentorders',
            localField: "_id",
            foreignField: "rentProduct",
            as: "bookings"
          }
        },
        {
          $match: {
            location: location,
            $or: [
              {
                bookings: { $size: 0 } // No bookings exist
              },
              {
                bookings: {
                  $not: {
                    $elemMatch: {
                      start: { $lte: end }, end: { $gte: start }
                    }
                  }
                }
              }
            ],
            isBlocked: false,
            adminisBlocked: false
          }
        }
      ]);





      return dataa

    } catch (error) {
      throw new HttpException(
        'there is some issue please try again later',
        HttpStatus.BAD_REQUEST
      )
    }
  }
  async rentDetail(id: string): Promise<any> {
    try {

      const obj = {}
      let total = 0
      let Total = 0
      let data = await this._reviewRentModel.findOne({ product: id })
      if (!data) {
        const product = await this._rentModel.findById({ _id: id }).populate('owner')
        return { total, obj, product, Total }
      }
      data = data['ratings_review']
      data.forEach((res: any) => {

        res = res['ratings']
        total += res
        if (!obj[res]) {
          obj[res] = 1
        } else {
          obj[res] += 1
        }
      })
      Total = total
      total = total / data.length
      const product = await this._rentModel.findById({ _id: id }).populate('owner')
      return { total, obj, product, Total }
    } catch (error) {
      throw new HttpException(
        'there is some issue please try again later',
        HttpStatus.BAD_REQUEST
      )
    }
  }
  async addrentOrder(orderDetails: rentorderDetails, userid: string): Promise<rentorderDetails> {
    try {
      console.log(orderDetails);

      const { date, owner, productID, totalAmount, paymentMethod } = orderDetails
      console.log(date);

      if (paymentMethod === 'wallet') {
        await this._userModel.findByIdAndUpdate({ _id: userid }, {
          $inc: { wallet: -totalAmount }, $push: {
            walletHistory: {
              date: new Date(),
              amount: -totalAmount,
              description: ` wallet payment - Order ${productID}`,
            },
          },
        })
      }
      const data = new this._rentOrderModel({
        user: userid,
        rentProduct: productID,
        start: date.start,
        end: date.end,
        owner: owner,
        totalAmount: totalAmount
      })
      return await data.save()

    } catch (error) {
      console.log(error);

      throw new HttpException(
        'there is some issue please try again later',
        HttpStatus.BAD_REQUEST
      )
    }
  }
  async rentHistory(id: string): Promise<rentorderDetails[]> {
    try {

      return this._rentOrderModel.find({ user: id }).populate('rentProduct').populate('owner').populate('user')
    } catch (error) {
      throw new HttpException(
        'there is some issue please try again later',
        HttpStatus.BAD_REQUEST
      )
    }
  }
  async getUserRentProduct(id: string): Promise<rent[]> {
    try {

      return this._rentModel.find({ owner: id }).populate('owner')
    } catch (error) {
      throw new HttpException(
        'there is some issue please try again later',
        HttpStatus.BAD_REQUEST
      )
    }
  }
  async blockRentProduct(productID: any): Promise<rent> {
    try {


      const { id, isBlocked } = productID
      if (isBlocked === false) {
        return this._rentModel.findByIdAndUpdate({ _id: id }, { $set: { isBlocked: true } })
      } else {
        return this._rentModel.findByIdAndUpdate({ _id: id }, { $set: { isBlocked: false } })
      }
    } catch (error) {
      throw new HttpException(
        'there is some issue please try again later',
        HttpStatus.BAD_REQUEST
      )
    }
  }
  async changeStatusRent(data: any): Promise<rent> {
    try {
      const { itemId, totalAmount, user } = data
      const value = await this._userModel.findByIdAndUpdate({ _id: user }, {
        $inc: { wallet: totalAmount }, $push: {
          walletHistory: {
            date: new Date(),
            amount: totalAmount,
            description: `Refunded for Rent cancelled- RentId : ${itemId}`,
          },
        },
      })
      return this._rentOrderModel.findByIdAndUpdate({ _id: itemId }, { $set: { status: 'cancelled' } })
    } catch (error) {
      throw new HttpException(
        'there is some issue please try again later',
        HttpStatus.BAD_REQUEST
      )
    }
  }
  async getRentProduct(): Promise<rent[]> {
    try {

      return this._rentModel.find().populate('owner')
    } catch (error) {
      throw new HttpException(
        'there is some issue please try again later',
        HttpStatus.BAD_REQUEST
      )
    }
  }
  async rentBlock(id: string, isBlocked: boolean): Promise<rent> {
    try {

      return this._rentModel.findByIdAndUpdate({ _id: id }, { $set: { adminisBlocked: !isBlocked } }, { upsert: true })
    } catch (error) {
      throw new HttpException(
        'there is some issue please try again later',
        HttpStatus.BAD_REQUEST
      )
    }
  }
  async imgDelete(index: number, id: string): Promise<rent> {

    try {

      await this._rentModel.findByIdAndUpdate(
        id,
        { $unset: { [`image.${index}`]: 1 } }
      );

      const result = await this._rentModel.findByIdAndUpdate(
        id,
        { $pull: { "image": null } },
        { new: true }
      );
      return result
    } catch (error) {
      throw new HttpException(
        'there is some issue please try again later',
        HttpStatus.BAD_REQUEST
      )
    }
  }
  async Editrent(img: any, rent_data: rent, user: string): Promise<rent> {
    try {
      const { name, cycle_Details, location, price } = rent_data
      console.log(img);

      if (img.length === 0) {
        return await this._rentModel.findByIdAndUpdate({ _id: user }, { $set: { name: name, cycle_Details: cycle_Details, location: location, price: price } })
      }
      return await this._rentModel.findByIdAndUpdate({ _id: user }, {
        $set: { name: name, cycle_Details: cycle_Details, location: location, price: price }, $push: {
          image: { $each: img.map(f => f.secure_url) },
        },
      })




    } catch (error) {
      throw new HttpException(
        'there is some issue please try again later',
        HttpStatus.BAD_REQUEST
      )
    }
  }
}