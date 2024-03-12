import { HttpException, HttpStatus, Inject, Res } from "@nestjs/common";
import { Model } from "mongoose";
import { Admin } from "../../admin/entities/admin.entity"
import { CreateAdminDto } from "../../admin/dto/create-admin.dto"
import { json } from "stream/consumers";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";
import { IAdminRepository } from "../interfaces/admin-repository.interface";
import { User, rent } from "src/users/entities/user.entity";
import { servicer } from "src/servicer/servicers.type";
import { brand, product } from "src/product/entities/product.entity";
export class AdminRepository implements IAdminRepository {
  constructor(
    @Inject('ADMIN_MODEL')
    private _adminModel: Model<Admin>,
    private _jwtService: JwtService,
    @Inject('USER_MODEL')
    private _userModel: Model<User>,
    @Inject('SERVICER_MODEL')
    private _servicerModel: Model<servicer>,
    @Inject('PRODUCT_MODEL')
    private _productModel: Model<product>,
    @Inject('ORDER_MODEL')
    private _orderModel: Model<any>,
    @Inject('BRAND_MODEL')
    private _brandModel: Model<brand>,
    @Inject('RENT_MODEL')
    private _rentModel: Model<rent>,
    @Inject('RENT_ORDER_MODEL')
    private _rentOrderModel: Model<any>,

  ) { }
  // admin login 
  async SignIn(user: CreateAdminDto, res: Response): Promise<Response> {
    try {
      const { email, password } = user
      const admindata = await this._adminModel.findOne({ email: email })
      if (admindata) {

        if (admindata.password === password) {
          const payload = { token: admindata._id, role: 'admin' };
          return res.status(HttpStatus.CREATED).json({
            access_token: await this._jwtService.sign(payload),
            message: 'Success',
          });

        } else {
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
  async dashboard() {
    try {
      const revenue = await this._orderModel.aggregate([
        {
          $unwind: {
            path: "$product",

          }
        },
        {
          $match: {
            "product.status":'delivered'
          }
        },
        {
          $lookup: {
            from: 'products',
            localField: 'product.id',
            foreignField: '_id',
            as: 'product_details'
          }
        }, {
          $addFields: {
            'product_details': {
              $first: '$product_details'
            }
          }
        },
        {
          $project: {
            revenue: { $multiply: ['$product.count', '$product_details.price'] }
          }
        }, {
          $group: {
            _id: null,
            revenue: {
              $sum: '$revenue'
            }
          }
        }
      ])
      const user = await this._userModel.find().countDocuments()
      const servicer = await this._servicerModel.find().countDocuments()
      const orders = await this._orderModel.find().countDocuments()
      const brandOrderCount = await this._orderModel.aggregate([{
        $lookup: {
          from: 'products',
          localField: 'product.id',
          foreignField: '_id',
          as: 'product_details'
        }
      }, {
        $unwind: {
          path: '$product_details',
        }
      }, {
        $group: {
          _id: '$product_details.brand',
          count: {
            $sum: 1
          }
        }
      }
      ])
      const category = await this._orderModel.aggregate([{
        $lookup: {
          from: 'products',
          localField: 'product.id',
          foreignField: '_id',
          as: 'product_details'
        }
      }, {
        $unwind: {
          path: '$product_details',
        }
      }, {
        $group: {
          _id: '$product_details.category',
          count: {
            $sum: 1
          }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category_data'
        }
      }, {
        $addFields: {
          category_data: { $first: '$category_data' }
        }
      }
      ])
      const brand = await this._brandModel.find()
          
            console.log(category);
            
      return {revenue, user, servicer, orders, brandOrderCount, brand,category}

    } catch (error) {
      throw new HttpException(
        error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async orders() {
    try {

      return await this._orderModel.find().populate('product.id').populate('user')
    } catch (error) {
      throw new HttpException(
        error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}