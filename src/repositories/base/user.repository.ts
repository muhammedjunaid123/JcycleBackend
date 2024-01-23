import { Inject, HttpException, HttpStatus } from "@nestjs/common";
import { CreateUserDto } from "../../users/dto/create-user.dto";
import { User } from "../../users/entities/user.entity";
import { Model } from "mongoose";
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from "src/users/dto/update-user.dto";
import { IUserRepository } from "../interfaces/user-repository.interface";
export class UserRepository implements IUserRepository {
  constructor(
    @Inject('USER_MODEL')
    private _userModel: Model<User>,

  ) { }
  //createUser 
  async createUser(user: CreateUserDto): Promise<User> {

    try {
      const { name, email, Mobile, password } = user;
      const exUser = await this._userModel.findOne({ email: email })

      if (exUser) {

        throw new HttpException(
          'the email has already been taken',
          HttpStatus.BAD_REQUEST)
      }
      const exMobile = await this._userModel.findOne({ phone: Mobile })


      if (exMobile) {
        throw new HttpException(
          'This phone number already taken. please try another.',
          HttpStatus.BAD_REQUEST)
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const createdUser = new this._userModel({
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
  // user login 
  async SignIn(user: CreateUserDto): Promise<User> {
    try {


      return await this._userModel.findOne({ email: user.email })

    } catch (error) {
      throw new HttpException(
        'There was an error with your login. Please try log again',
        HttpStatus.BAD_REQUEST,
      );
    }


  }

  async userFindId(userId: string): Promise<User> {
    return await this._userModel.findOne({ _id: userId });
  }

  async findAlluser(): Promise<User[]> {
    return await this._userModel.find()
  }
  // to block or unblock the user
  async userBlock_and_unblock(id: string, userdata: UpdateUserDto): Promise<User> {
    const { isBlocked } = userdata

    return await this._userModel.findByIdAndUpdate({ _id: id }, { $set: { isBlocked: isBlocked } })
  }

  async userDetails(id: string): Promise<User> {
    return await this._userModel.findById({ _id: id })
  }
  async verified(id: string): Promise<User> {
    return await this._userModel.findByIdAndUpdate({ _id: id }, { $set: { isVerified: true } })
  }

  async loadWallet(id: string): Promise<User> {
    return await this._userModel.findById({ _id: id })
  }
  async userData(user: string): Promise<User> {
    return await this._userModel.findById({ _id: user })
  }
  async updateName(user: string, name: string): Promise<User> {
    return await this._userModel.findByIdAndUpdate({ _id: user }, { $set: { name: name['name'] } })
  }
}