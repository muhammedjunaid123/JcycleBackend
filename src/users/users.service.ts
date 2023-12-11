import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from '../repositories/base/user.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as otpGenerator from 'otp-generator';
import { MailerService } from '@nestjs-modules/mailer';


@Injectable()
export class UsersService {
  constructor(private UserRepository: UserRepository, private _jwtService: JwtService,private _mailerService:MailerService) {

  }
  //service for user registration
  async SignUp(createUserDto: CreateUserDto, res: Response) {

     const userdata=await this.UserRepository.createUser(createUserDto)
     return res.status(HttpStatus.CREATED).json({
      message: 'success',
      id: userdata['_id'],
    });

  }
  //service for user login 
  async signIn(createUserDto: CreateUserDto,res :Response) {
    const userData = await this.UserRepository.SignIn(createUserDto);

    if (userData) {

      const user = await bcrypt.compare(createUserDto.password, userData.password)

      if (user) {
        const payload = { token: userData._id, role: 'user' };
      return res.status(HttpStatus.CREATED).json({
        access_token: await this._jwtService.sign(payload),
        message: 'Success',
      });
      } else {
        throw new HttpException(
          'email or password incorrect',
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


  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async  sendMail(res: Response, id: string) {
    try {
      const findId = await this.UserRepository.userFindId(id);
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
      const payload = { token: findId['_id'] };
      
       const token=res.status(HttpStatus.CREATED).json({
        message: 'Success',
        otp: otp,
        access_token: await this._jwtService.sign(payload),
      });
      return {token}
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
  userDetails(id:string){
    return this.UserRepository.userDetails(id)
  }
}
