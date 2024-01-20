import { Body, Controller, Get, Patch, Post, Query, Res } from '@nestjs/common';
import { ServicerService } from './servicer.service';
import { Response } from 'express';

@Controller('servicer')
export class ServicerController {
  constructor(private readonly _servicerService: ServicerService) { }
  @Post('servicer')
  addservicer(@Body() data: any) {
    return this._servicerService.addservicer(data)
  }
  @Post('login')
  loginServicer(@Body() data:any,@Res() res:Response) {
    return this._servicerService.login(data,res)
  }

  @Get('otpVerification')
  async sendMail(@Query('id') id: string, @Res() res: Response) {
    return this._servicerService.sendMail(res, id);
  }
  @Patch('verified')
  async verifiedUser(@Query('id') id: string) {

    return this._servicerService.verified(id)
  }

}
