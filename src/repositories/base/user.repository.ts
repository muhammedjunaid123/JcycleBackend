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
    @Inject('CHAT_MODEL')
    private _chatModel: Model<any>,

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
    try {
      
      return await this._userModel.findOne({ _id: userId });
    } catch (error) {
      throw new HttpException(
        'there is some issue please try again later',
        HttpStatus.BAD_REQUEST
       )    
    }
  }

  async findAlluser(): Promise<User[]> {
    try {
      
      return await this._userModel.find()
    } catch (error) {
      throw new HttpException(
        'there is some issue please try again later',
        HttpStatus.BAD_REQUEST
       )    
    }
  }
  // to block or unblock the user
  async userBlock_and_unblock(id: string, userdata: UpdateUserDto): Promise<User> {
    try {
      
    const { isBlocked } = userdata

    return await this._userModel.findByIdAndUpdate({ _id: id }, { $set: { isBlocked: isBlocked } })
  } catch (error) {
    throw new HttpException(
      'there is some issue please try again later',
      HttpStatus.BAD_REQUEST
     )     
  }
  }

  async userDetails(id: string): Promise<User> {
    try {
      
      return await this._userModel.findById({ _id: id })
    } catch (error) {
      throw new HttpException(
        'there is some issue please try again later',
        HttpStatus.BAD_REQUEST
       )  
    }
  }
  async verified(id: string): Promise<User> {
    try {
      
      return await this._userModel.findByIdAndUpdate({ _id: id }, { $set: { isVerified: true } })
    } catch (error) {
      throw new HttpException(
        'there is some issue please try again later',
        HttpStatus.BAD_REQUEST
       )    
    }
  }

  async loadWallet(id: string): Promise<User> {
    try {
      
      return await this._userModel.findById({ _id: id })
    } catch (error) {
      throw new HttpException(
        'there is some issue please try again later',
        HttpStatus.BAD_REQUEST
       )  
    }
  }
  async userData(user: string): Promise<User> {
    try {
      
      return await this._userModel.findById({ _id: user })
    } catch (error) {
      throw new HttpException(
        'there is some issue please try again later',
        HttpStatus.BAD_REQUEST
       )    
    }
  }
  async updateName(user: string, name: string): Promise<User> {
    try {
      
      return await this._userModel.findByIdAndUpdate({ _id: user }, { $set: { name: name['name'] } })
    } catch (error) {
      throw new HttpException(
        'there is some issue please try again later',
        HttpStatus.BAD_REQUEST
       )     
    }
  }
  async findConnection(userId: string, id: string): Promise<any> {
    try {
      
    return await this._chatModel
      .findOne({
        users: { $all: [userId, id] },
      })
      .populate('messages.sender')
      .populate('messages.receiver');
    } catch (error) {
      throw new HttpException(
        'there is some issue please try again later',
        HttpStatus.BAD_REQUEST
       )  
    }
  }
  async createRoom(userId: string, id: string): Promise<any> {
    try {
      
  
    const newRoom = new this._chatModel({
      users: [userId, id],
    });
    return newRoom.save();
  } catch (error) {
    throw new HttpException(
      'there is some issue please try again later',
      HttpStatus.BAD_REQUEST
     )     
  }
  }
}