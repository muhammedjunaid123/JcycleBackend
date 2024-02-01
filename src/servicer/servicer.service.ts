import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { servicerRepository } from 'src/repositories/base/servicers.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as otpGenerator from 'otp-generator';
import { MailerService } from '@nestjs-modules/mailer';
import { jwtDecode } from 'jwt-decode';
@Injectable()
export class ServicerService {
    constructor(private _servicerRepository: servicerRepository,
        private _jwtService: JwtService,
        private _mailerService: MailerService,
    ) { }

    addservicer(data: any) {

        return this._servicerRepository.addservicer(data)


    }
    async login(data: any, res: Response) {


        const servicerData = await this._servicerRepository.login(data)

        if (servicerData) {

            const user = await bcrypt.compare(data.password, servicerData['password'])


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
                const payload = { token: servicerData['_id'], role: 'servicer' };
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
            const findId = await this._servicerRepository.ServicerFindId(id);
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
            const payload = { token: findId['_id'], role: 'servicer' };
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
        return this._servicerRepository.verified(id)

    }

    addService(data: any, servicer: string) {
        const servicerId = jwtDecode(servicer)
        return this._servicerRepository.addService(data, servicerId['token'])
    }
    GetService() {
        return this._servicerRepository.GetService()
    }
    blockService(id: string, isBlocked: boolean) {
        return this._servicerRepository.blockService(id, isBlocked)
    }
    getServiceById(id: string) {
        return this._servicerRepository.getServiceById(id)
    }
    editService(id: string, data: any) {
        return this._servicerRepository.editService(id, data)
    }
    getUserserviceHistory(id: string) {
        const decoded = jwtDecode(id);
        return this._servicerRepository.getUserserviceHistory(decoded['token'])
    }
    serviceOrderCancel(data: any) {
        return this._servicerRepository.serviceOrderCancel(data)
    }
    servicer() {
        return this._servicerRepository.servicer()
    }
    async getRecentUsers(res: Response, req: Request) {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader.split(' ')[1];
            const decoded = await this._jwtService.verify(token);
            const servicerId = decoded.token;
            const findConnection =
                await this._servicerRepository.findConnection(servicerId);
            if (!findConnection) {
                return res.status(HttpStatus.OK).json({
                    message: 'No users available.',
                });
            }
            const userSenderTypes = findConnection.messages
                .filter((message) => message.senderType === 'User')
                .map((message) => ({
                    name: message.sender.name,
                    id: message.sender._id,
                }));
            const uniqueUserSenderTypes = [
                ...new Set(userSenderTypes.map((obj) => JSON.stringify(obj))),
            ].map((str) => JSON.parse(str as string));
            return res.status(HttpStatus.OK).json({
                message: 'Success',
                uniqueUserSenderTypes,
                servicerId,
            });
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
    async getRecentChats(id: string, res: Response, req: Request) {
        try {
          const authHeader = req.headers['authorization'];
          const token = authHeader.split(' ')[1];
          const decoded = await this._jwtService.verify(token);
          const servicerId = decoded.token;
          const findConnection = await this._servicerRepository.recentChats(
            servicerId,
            id,
          );
          if (findConnection) {
            return res.status(HttpStatus.OK).json({
              message: findConnection,
              servicerId: servicerId,
              id: findConnection._id,
            });
          } else {
            const newRoom = this._servicerRepository.createRoom(servicerId, id);
            newRoom.then((data: any) => {
              return res
                .status(HttpStatus.ACCEPTED)
                .json({ message: data, servicerId: servicerId, id: data._id });
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
      async getMyDetails(res: Response, req: Request) {
        try {
          const authHeader = req.headers['authorization'];
          const token = authHeader.split(' ')[1];
          const decoded = await this._jwtService.verify(token);
          const servicerId = decoded.token;
          const details = await this._servicerRepository.servicerFindId(servicerId);
          console.log(details);
          
          return res.status(HttpStatus.OK).json({ details });
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
       updateName(servicerId:string,name:string){
          
        const decode=jwtDecode(servicerId['id'])
       return  this._servicerRepository.updateName(decode['token'],name)
       }
       ServicerData(id:string){
        const decode=jwtDecode(id)
        return this._servicerRepository.ServicerData(decode['token'])
       }
       serviceFilter(time:string,date:Date,location:string){
        return this._servicerRepository.serviceFilter(time,date,location)
       }
       dashboard(id:string){
        const decode=jwtDecode(id)
        return this._servicerRepository.dashboard(decode['token'])
       }
}

