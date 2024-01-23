import { HttpException, HttpStatus, Inject, Res } from "@nestjs/common";
import { Model } from "mongoose";
import { Admin } from "../../admin/entities/admin.entity"
import { CreateAdminDto } from "../../admin/dto/create-admin.dto"
import { json } from "stream/consumers";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";
import { IAdminRepository } from "../interfaces/admin-repository.interface";
export class AdminRepository implements IAdminRepository {
  constructor(
    @Inject('ADMIN_MODEL')
    private _adminModel: Model<Admin>,
    private _jwtService: JwtService,
  ) { }
  // admin login 
  async SignIn(user: CreateAdminDto, res:Response):Promise<Response> {
    try {
      const { email,password } = user
      const admindata = await this._adminModel.findOne({ email: email })
      if (admindata) {
       
           if( admindata.password===password){
            const  payload= { token: admindata._id, role: 'admin' };
            return res.status(HttpStatus.CREATED).json({
              access_token: await this._jwtService.sign(payload),
              message: 'Success',
            });
              
           }else{
             throw new HttpException(
              'password incorrect',
             HttpStatus.BAD_REQUEST,
        );
           }
        
      } else {
        throw new HttpException(
          'not found',
          HttpStatus.BAD_REQUEST,
        );
      }

    } catch (error) {
      throw new HttpException(
        error,
        HttpStatus.BAD_REQUEST,
      );
    }


  }
}