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
  ) { }
  async addrent(img: any, rent_data: rent, user: string):Promise<rent> {
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
        error.error,
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async loadRentBicycle(data: any):Promise<rent[]> {
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
                      $or: [
                        { start: { $lte: end }, end: { $gte: start } }, // Existing booking overlaps
                        { start: { $gte: end }, end: { $lte: start } }  // Existing booking is within the specified range
                      ]
                    }
                  }
                }
              }
            ],
            isBlocked:false,
            adminisBlocked:false
          }
        }
      ]);
      


    

      return dataa

    } catch (error) {

    }
  }
  async rentDetail(id: string):Promise<rent> {
    return this._rentModel.findById({ _id: id }).populate('owner')
  }
  async addrentOrder(orderDetails: rentorderDetails, userid: string):Promise<rentorderDetails> {
    const { Date, owner, productID, totalAmount } = orderDetails




    const data = new this._rentOrderModel({
      user: userid,
      rentProduct: productID,
      start: Date.start,
      end: Date.end,
      owner: owner,
      totalAmount: totalAmount
    })
    return await data.save()


  }
 async rentHistory(id:string):Promise<rentorderDetails[]>{
 return this._rentOrderModel.find({user:id}).populate('rentProduct').populate('owner').populate('user')
  }
  async getUserRentProduct(id:string):Promise<rent[]>{
    return this._rentModel.find({owner:id}).populate('owner')
  }
  async blockRentProduct(productID:any):Promise<rent>{
      const {id,isBlocked}=productID
      if(isBlocked===false){
        return this._rentModel.findByIdAndUpdate({_id:id},{$set:{isBlocked:true}})
      }else{
        return this._rentModel.findByIdAndUpdate({_id:id},{$set:{isBlocked:false}})
      }
  }
  async changeStatusRent(data:any):Promise<rent>{
   const {itemId,totalAmount,user}=data
   const value= await this._userModel.findByIdAndUpdate({_id:user},{$inc:{wallet:totalAmount},$push: {
    walletHistory: {
      date: new Date(),
      amount: totalAmount,
      description: `Refunded for Rent cancelled- RentId : ${itemId}`,
    },
  },})
  return this._rentOrderModel.findByIdAndUpdate({_id:itemId},{$set:{status:'cancelled'}})

  }
 async getRentProduct():Promise<rent[]>{
  return this._rentModel.find().populate('owner')
  }
  async rentBlock(id:string,isBlocked:boolean):Promise<rent>{
   
    return this._rentModel.findByIdAndUpdate({_id:id},{$set:{adminisBlocked:!isBlocked}},{upsert:true})
  }
 
}