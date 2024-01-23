import { Inject } from "@nestjs/common";
import { promises } from "dns";
import { Model } from "mongoose";
import { IReviewRepository } from "../interfaces/review-repository.interface";


export class reviewRepository  implements IReviewRepository{
    constructor(

        @Inject('REVIEW_MODEL')
        private _reviewModel: Model<any>,
        @Inject('RENTREVIEW_MODEL')
        private _reviewRentModel: Model<any>
    ) { }
    async addReview(user: string, review: string, ratings: number, productID: string):Promise<any> {

        const exist = await this._reviewModel.findOne({ product: productID })
        if (exist) {
            return await this._reviewModel.findOneAndUpdate({ product: productID }, { $push: { ratings_review: { ratings: ratings, review: review } } })
        } else {


            const data = new this._reviewModel({
                user: user,
                product:productID,
                ratings_review: [
                    {
                        ratings: ratings,
                        review: review
                    }

                ]
            })
            return await data.save()
        }
    }
   async Review(id:string):Promise<any>{
  
      const data=await this._reviewModel.findOne({product:id['id']}).populate('product').populate('user').exec();
      console.log(data);
      
      return data
   }
   async addrentReview(user: string, review: string, ratings: number, productID: string):Promise<any> {

    const exist = await this._reviewRentModel.findOne({ product: productID })
    if (exist) {
        return await this._reviewRentModel.findOneAndUpdate({ product: productID }, { $push: { ratings_review: { ratings: ratings, review: review } } })
    } else {


        const data = new this._reviewRentModel({
            user: user,
            product:productID,
            ratings_review: [
                {
                    ratings: ratings,
                    review: review
                }

            ]
        })
        return await data.save()
    }
}
async rentReview(id:string):Promise<any>{
  
    const data=await this._reviewRentModel.findOne({product:id['id']}).populate('product').populate('user').exec();
    console.log(data);
    
    return data
 }

}
      
    