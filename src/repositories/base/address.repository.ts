import { Inject } from "@nestjs/common";
import { Model } from "mongoose";
import { User, address } from "src/users/entities/user.entity";

export class addressRepository {
    constructor(
        @Inject('ADDRESS_MODEL')
        private _addressModel: Model<any>,
        @Inject('USER_MODEL')
        private _userModel: Model<User>,

    ) { }
    async addAddress(user: string, addressData: address) {
        console.log(user);
        const { city, country, district, fname, housename, lname, mobile, pin, state, email } = addressData

        const userData = await this._addressModel.findOne({ user: user })
        if (!userData) {
            const data = new this._addressModel({
                user: user,
                address: [{
                    city: city,
                    email: email,
                    country: country,
                    district: district,
                    fname: fname,
                    housename: housename,
                    lname: lname,
                    mobile: mobile,
                    pin: pin,
                    state: state
                }]
            })
            return await data.save()
        } else {
            return await this._addressModel.findOneAndUpdate(
                { user: user },
                {
                    $push: {
                        address: {
                            city: city,
                            email: email,
                            country: country,
                            district: district,
                            fname: fname,
                            housename: housename,
                            lname: lname,
                            mobile: mobile,
                            pin: pin,
                            state: state
                        }
                    }
                }
            );

        }
    }
   async Address(user:string){
     return await this._addressModel.findOne({user:user})
    }
}