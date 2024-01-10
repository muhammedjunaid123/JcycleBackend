import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { Model } from "mongoose";
import { rent } from "src/users/entities/user.entity";

export class rentRepository {
    constructor(
        @Inject('RENT_MODEL')
        private _rentModel: Model<rent>
    ) { }
    async addrent(img: any, rent_data: rent) {
        try {


            const image = []
            for (let f of img) {
                image.push(f.secure_url)
            }
            const { name, cycle_Details, location, owner, price } = rent_data
            const rent = new this._rentModel({
                name: name,
                cycle_Details: cycle_Details,
                location: location,
                owner: owner,
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

    loadRentBicycle(){
        try {
            return this._rentModel.find()
            
        } catch (error) {
            
        }
    }

}