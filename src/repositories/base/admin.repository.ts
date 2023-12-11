import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { Model } from "mongoose";
import { Admin } from "../../admin/entities/admin.entity"
import { CreateAdminDto } from "../../admin/dto/create-admin.dto"
export class AdminRepository {
  constructor(
    @Inject('ADMIN_MODEL')
    private _adminModel: Model<Admin>,
  ) { }
  // admin login 
  async SignIn(user: CreateAdminDto) {
    try {
      const { email,password } = user
      const admindata = await this._adminModel.findOne({ email: email })
      if (admindata) {
           if( admindata.password===password){
            return admindata
           }else{
             throw new HttpException(
          'There was an error with your login. Please try log again',
          HttpStatus.BAD_REQUEST,
        );
           }
        
      } else {
        throw new HttpException(
          'There was an error with your login. Please try log again',
          HttpStatus.BAD_REQUEST,
        );
      }

    } catch (error) {
      throw new HttpException(
        'There was an error with your login. Please try log again',
        HttpStatus.BAD_REQUEST,
      );
    }


  }
}