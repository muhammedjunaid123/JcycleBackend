import { Inject } from "@nestjs/common";
import { Model } from "mongoose";
import { User, address } from "src/users/entities/user.entity";
import { IAddressRepository } from "../interfaces/address-repository.interface";

export class addressRepository implements IAddressRepository {
    constructor(
        @Inject('ADDRESS_MODEL')
        private _addressModel: Model<any>,
        @Inject('USER_MODEL')
        private _userModel: Model<User>,

    ) { }
    async addAddress(user: string, addressData: address): Promise<address> {
        try {


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
        } catch (error) {

        }
    }
    async Address(user: string): Promise<address> {
        try {
            return await this._addressModel.findOne({ user: user })
        } catch (error) {

        }

    }
}