import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { log } from "console";
import { jwtDecode } from "jwt-decode";
import { Model } from "mongoose";
import { rent, rentorderDetails } from "src/users/entities/user.entity";
import { format } from 'date-fns-tz';

export class rentRepository {
  constructor(
    @Inject('RENT_MODEL')
    private _rentModel: Model<rent>,
    @Inject('RENT_ORDER_MODEL')
    private _rentOrderModel: Model<any>
  ) { }
  async addrent(img: any, rent_data: rent, user: string) {
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

  async loadRentBicycle(data: any) {
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
            ]
          }
        }
      ]);
      


    

      return dataa

    } catch (error) {

    }
  }
  async rentDetail(id: string) {
    return this._rentModel.findById({ _id: id }).populate('owner')
  }
  async addrentOrder(orderDetails: rentorderDetails, userid: string) {
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
}