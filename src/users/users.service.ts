import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from '../repositories/base/user.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as otpGenerator from 'otp-generator';
import { MailerService } from '@nestjs-modules/mailer';
import { cartRepository } from 'src/repositories/base/cart.repository';
import { wishlistRepository } from 'src/repositories/base/wishlist.repository';
import { jwtDecode } from "jwt-decode";
import { orderRepository } from 'src/repositories/base/order.repository';
import { reviewRepository } from 'src/repositories/base/review.repository';
import { ImageService } from 'src/image/image.service';
import { User, address, rent, rentorderDetails } from './entities/user.entity';
import { rentRepository } from 'src/repositories/base/rent.repository';
import { addressRepository } from 'src/repositories/base/address.repository';
import { locationRepository } from 'src/repositories/base/location.repository';
import { servicerRepository } from 'src/repositories/base/servicers.repository';

@Injectable()
export class UsersService {
  constructor(private _UserRepository: UserRepository,
    private _cartRepository: cartRepository,
    private _jwtService: JwtService,
    private _mailerService: MailerService,
    private _wishlistRepository: wishlistRepository,
    private _orderRepository: orderRepository,
    private _reviewRepository: reviewRepository,
    private _image: ImageService,
    private _rentRepository: rentRepository,
    private _addressRepository: addressRepository,
    private _locationRepository: locationRepository,
    private _servicerRepository: servicerRepository
  ) {

  }
  //service for user registration
  async SignUp(createUserDto: CreateUserDto, res: Response) {

    return await this._UserRepository.createUser(createUserDto)


  }

  //service for user login 
  async signIn(createUserDto: CreateUserDto, res: Response) {
    const userData: User = await this._UserRepository.SignIn(createUserDto);

    if (userData) {

      const user = await bcrypt.compare(createUserDto.password, userData.password)
      console.log(user);

      if (user) {
        if (user.isVerified === false) {
          throw new HttpException(
            'This user is not verified',
            HttpStatus.BAD_REQUEST,
          );
        }
        if (user.isBlocked === true) {
          throw new HttpException(
            'This user block by admin',
            HttpStatus.BAD_REQUEST,
          );
        }
        const payload = { token: userData._id, role: 'user' };
        let token = await this._jwtService.sign(payload)
        console.log(token);

        return res.status(HttpStatus.CREATED).json({
          access_token: token,
          message: 'Success',
        });
      } else {
        throw new HttpException(
          ' password incorrect',
          HttpStatus.BAD_REQUEST,
        );
      }

    } else {
      throw new HttpException(
        'user not found!',
        HttpStatus.NOT_FOUND,
      );
    }
  }





  async sendMail(res: Response, id: string) {
    try {
      const findId = await this._UserRepository.userFindId(id);
      const otp = await otpGenerator.generate(4, {
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      console.log(otp);


      this._mailerService.sendMail({
        to: `${findId['email']}`,
        from: process.env.DEV_MAIL,
        subject: 'JCYCLE Email Verification',
        text: 'JCYCLE',
        html: `<table style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <tr>
            <td style="text-align: center; background-color: #000; padding: 10px; color: #fff;">
                <h1>OTP Verification</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px;">
                <p>Hello, ${findId['name'].toUpperCase()}</p>
                <p>You are just one step away from accessing our platform. To ensure your security and access to our WEBSITE, please verify your identity by entering the OTP (One-Time Password) provided below:</p>
                <p>OTP: <strong style="background-color: #000;color: #fff;">${otp}</strong></p>
                <p>Please use this OTP to complete the verification process .</p>
                <p>If you did not request this verification, please ignore this email, and contact our support team immediately.</p>
                <p>Thank you for choosing our platform. We look forward to having you as part of our community.</p>
                <p>If you have any questions or need assistance, please feel free to contact our support team.</p>
                <p>Best regards,<br>JCYCLE Team</p>
            </td>
        </tr>
        <tr>
            <td style="text-align: center; background-color: #000; padding: 10px; color: #fff;">
                <p>&copy; ${new Date().getFullYear()}JCYCLE. All rights reserved.</p>
            </td>
        </tr>
    </table>
    `,
      });
      const payload = { token: findId['_id'], role: 'user' };
      const Token = await this._jwtService.sign(payload)
      console.log(Token);

      const token = res.status(HttpStatus.CREATED).json({
        message: 'Success',
        otp: otp,
        access_token: Token
      });


      return { token }
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.getStatus()).json({
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'Internal Server Error',
        });
      }
    }
  }
  verified(id: string) {
    return this._UserRepository.verified(id)

  }
  userDetails(id: string) {

    return this._UserRepository.userDetails(id)
  }

  addcart(cartdata: CreateUserDto) {
    const { id, user, price } = cartdata

    const decoded = jwtDecode(user);

    return this._cartRepository.addCart(id, decoded['token'], price)


  }
  addwishlist(wishlistdata: CreateUserDto) {
    const { id, user } = wishlistdata
    const decoded = jwtDecode(user);
    return this._wishlistRepository.addWishlist(id, decoded['token'])

  }
  wishlist(user: string) {
    const decoded = jwtDecode(user['id']);
    return this._wishlistRepository.Wishlist(decoded['token'])
  }
  cart(user: string) {
    const decoded = jwtDecode(user['id']);
    return this._cartRepository.cart(decoded['token'])
  }
  cartRemove(data: CreateUserDto) {
    const { id, user, price, count } = data
    const decoded = jwtDecode(user);
    return this._cartRepository.cartRemove(id, decoded['token'], price, count)
  }
  cartUpdate(data: CreateUserDto) {
    const { id, count, user, price } = data
    const decoded = jwtDecode(user);

    return this._cartRepository.cartUpdate(decoded['token'], id, count, price)
  }
  addOrder(data: any) { 
    const { user, razorId, paymentMethod,location } = data   
    const decoded = jwtDecode(user);
    return this._orderRepository.addOrder(decoded['token'],razorId,paymentMethod,location)
  }
  loadOrder(id: string) {
    const decoded = jwtDecode(id['id']);
    return this._orderRepository.loadOrder(decoded['token'])
  }

  orderStatusUpdate(data: any) {
    const { user, orderID, value, Total } = data
    return this._orderRepository.orderStatusUpdate(user['_id'], orderID, value, Total)
  }
  loadWallet(id: string) {
    const decoded = jwtDecode(id['id']);
    return this._UserRepository.loadWallet(decoded['token'])
  }
  addReview(data: any) {
    const { user, review, ratings, productID } = data
    const decoded = jwtDecode(user);

    if (review.trim() === '') {
      throw new HttpException(
        'review can be null',
        HttpStatus.BAD_REQUEST,
      )
    }
    return this._reviewRepository.addReview(decoded['token'], review.trim(), ratings, productID)
  }
  Review(id: string) {
    return this._reviewRepository.Review(id)
  }
  userData(user: string) {

    const decoded = jwtDecode(user['id']);
    return this._UserRepository.userData(decoded['token'])
  }
  updateName(user: string, name: string) {
    const decoded = jwtDecode(user['id']);
    return this._UserRepository.updateName(decoded['token'], name)
  }
  async addrent(rent_data: rent, files: Array<Express.Multer.File>, user: string, res: Response) {
    const image = await this._image.upload(files);
    console.log(image);
    const decoded = jwtDecode(user);
    await this._rentRepository.addrent(image, rent_data, decoded['token'])
    return res.status(HttpStatus.CREATED).json({

    });
  }
  loadRentBicycle(data: any) {
    return this._rentRepository.loadRentBicycle(data)
  }
  addAddress(addressData: address, user: string) {
    console.log(user);

    const decoded = jwtDecode(user);
    return this._addressRepository.addAddress(decoded['token'], addressData)
  }
  Address(user: string) {
    const decoded = jwtDecode(user);
    return this._addressRepository.Address(decoded['token'])
  }
  rentDetail(id: string) {
    return this._rentRepository.rentDetail(id)
  }
  addrentOrder(orderDetails: rentorderDetails) {
    let {paymentMethod, user } = orderDetails
    const decoded = jwtDecode(user);

    return this._rentRepository.addrentOrder(orderDetails, decoded['token'])
  }

  addlocation(data: any) {
    return this._locationRepository.addLocation(data)
  }
  location() {
    return this._locationRepository.location()
  }
  rentHistory(id: string) {
    const decoded = jwtDecode(id);
    return this._rentRepository.rentHistory(decoded['token'])
  }
  getUserRentProduct(id: string) {
    const decoded = jwtDecode(id);
    return this._rentRepository.getUserRentProduct(decoded['token'])
  }
  blockRentProduct(productId: any) {

    return this._rentRepository.blockRentProduct(productId)
  }
  changeStatusRent(data: any) {

    return this._rentRepository.changeStatusRent(data)
  }
  getAllService() {
    return this._servicerRepository.GetAllServiceUser()
  }
  addServiceOrder(data: any) {

    const decoded = jwtDecode(data['user']);

    return this._servicerRepository.addServiceOrder(data, decoded['token'])
  }
  getUserserviceHistory(id: string) {
    const decoded = jwtDecode(id);
    return this._servicerRepository.getUserserviceHistory(decoded['token'])
  }
  serviceOrderCancel(data: any) {
    return this._servicerRepository.serviceOrderCancel(data)
  }

  addrentReview(data: any) {
    const { user, review, ratings, productID } = data
    const decoded = jwtDecode(user);

    if (review.trim() === '') {
      throw new HttpException(
        'review can be null',
        HttpStatus.BAD_REQUEST,
      )
    }
    return this._reviewRepository.addrentReview(decoded['token'], review.trim(), ratings, productID)
  }
  rentReview(id: string) {
    return this._reviewRepository.rentReview(id)
  }
  imgDelete(index: number, id: string) {
    console.log('enter 2');

    return this._rentRepository.imgDelete(index, id)
  }
  async Editrent(rent_data: rent, files: Array<Express.Multer.File>, ProductId: string, res: Response) {
    let image = []
    if (files !== undefined) {
      image = await this._image.upload(files);
      console.log(image);
    }
    await this._rentRepository.Editrent(image, rent_data, ProductId)
    return res.status(HttpStatus.CREATED).json({

    });
  }
  async getRecentChats(id: string, res: Response, req: Request) {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader.split(' ')[1];
      const decoded = await this._jwtService.verify(token);
      const userId = decoded.token;
      const findConnection = await this._UserRepository.findConnection(
        userId,
        id,
      );
      if (findConnection) {
        return res
          .status(HttpStatus.OK)
          .json({ message: findConnection, userId: userId });
      } else {
        const newRoom = this._UserRepository.createRoom(userId, id);
        newRoom.then((data: any) => {
          return res
            .status(HttpStatus.CREATED)
            .json({ userId: userId, message: data });
        });
      }
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.getStatus()).json({
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'Internal Server Error',
        });
      }
    }
  }
  servicerDetails(id:string){
     return this._servicerRepository.servicerFindId(id)
  }
  getAddress(id:string,user:string){
    const decoded = jwtDecode(user);
   return this._addressRepository.getAddress(id,decoded['token'])
  }
  updateAddress(id:string,data:address,user:string){
    const decoded = jwtDecode(user);
    return this._addressRepository.updateAddress(id,data,decoded['token'])
  }
  addressDelete(user:string,id:string){
    const decoded = jwtDecode(user);
    return this._addressRepository.addressDelete(decoded['token'],id)
  }
  getService(id:string){
    return this._servicerRepository.getService(id)
  }
}

