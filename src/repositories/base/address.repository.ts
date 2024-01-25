import { HttpException, HttpStatus, Inject } from "@nestjs/common";
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
           throw new HttpException(
            'there is some issue please try again later',
            HttpStatus.BAD_REQUEST
           )
        }
    }
    async Address(user: string): Promise<address> {
        try {
            return await this._addressModel.findOne({ user: user })
        } catch (error) {
            throw new HttpException(
                'there is some issue please try again later',
                HttpStatus.BAD_REQUEST
               )
        }

    }

    async getAddress(id: string, user: string) {
        try {
            return await this._addressModel.findOne({ user: user }, { address: { $elemMatch: { _id: id } } })
        } catch (error) {
            throw new HttpException(
                'there is some issue please try again later',
                HttpStatus.BAD_REQUEST
               )
        }
    }
    async updateAddress(id: string, data: address, user: string) {
        
        try {
    
            const { city, country, district, email, fname, housename, lname, mobile, pin, state } = data
            return await this._addressModel.findOneAndUpdate({ user: user, address: { $elemMatch: { _id: id } } }, {
                $set: {
                    'address.$.fname': fname,
                    'address.$.lname': lname,
                    'address.$.mobile': mobile,
                    'address.$.email': email,
                    'address.$.housename': housename,
                    'address.$.city': city,
                    'address.$.state': state,
                    'address.$.district': district,
                    'address.$.country': country,
                    'address.$.pin': pin,
                }
            })
        } catch (error) {
            throw new HttpException(
                'there is some issue please try again later',
                HttpStatus.BAD_REQUEST
               )
        }
    }
  async  addressDelete(user:string,id:string){
    try {
        
        return await this._addressModel.findOneAndUpdate(
            { user: user },
            { $pull: { address: { _id: id } } },
            { new: true } // Optionally, set this to true to return the modified document
            );
        } catch (error) {
            throw new HttpException(
                'there is some issue please try again later',
                HttpStatus.BAD_REQUEST
               ) 
        }
      
  }
}