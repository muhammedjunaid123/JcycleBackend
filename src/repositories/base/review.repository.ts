import { Inject } from "@nestjs/common";
import { Model } from "mongoose";


export class reviewRepository {
    constructor(

        @Inject('REVIEW_MODEL')
        private _reviewModel: Model<any>
    ) { }
    async addReview(user: string, review: string, ratings: number, productID: string) {

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
   async Review(id:string){
  
      const data=await this._reviewModel.findOne({product:id['id']}).populate('product').populate('user').exec();
      console.log(data);
      
      return data
   }
}
      
    