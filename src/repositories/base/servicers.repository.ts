import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { Model } from "mongoose";
import { User } from "src/users/entities/user.entity";
import * as bcrypt from 'bcrypt';

export class servicerRepository {

    constructor(
        @Inject('SERVICER_MODEL')
        private _servicerModel: Model<User>,

    ) { }
    async addservicer(data: any) {


        try {
            const { name, email, Mobile, password } = data;
            const exUser = await this._servicerModel.findOne({ email: email })

            if (exUser) {

                throw new HttpException(
                    'the email has already been taken',
                    HttpStatus.BAD_REQUEST)
            }
            const exMobile = await this._servicerModel.findOne({ phone: Mobile })


            if (exMobile) {
                throw new HttpException(
                    'This phone number already taken. please try another.',
                    HttpStatus.BAD_REQUEST)
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const createdUser = new this._servicerModel({
                name: name,
                email: email,
                phone: Mobile,
                password: hashedPassword,
            });
            return await createdUser.save();


        } catch (error) {
            throw new HttpException(
                error,
                HttpStatus.BAD_REQUEST,
            );

        }
    }
    async login(data:any){
        try {


            return await this._servicerModel.findOne({ email: data.email })
      
          } catch (error) {
            throw new HttpException(
              'There was an error with your login. Please try log again',
              HttpStatus.BAD_REQUEST,
            );
          }
      
    }
    async ServicerFindId(id:string){
    return this._servicerModel.findById(id)
    }
    async verified(id: string) {
      
        return await this._servicerModel.findByIdAndUpdate({ _id: id }, { $set: { isVerified: true } })
      }
}