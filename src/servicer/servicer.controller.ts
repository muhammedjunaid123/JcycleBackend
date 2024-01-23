import { Body, Controller, Get, Patch, Post, Query, Res } from '@nestjs/common';
import { ServicerService } from './servicer.service';
import { Response, query } from 'express';

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
  @Post('addService')
  addservice(@Body('data') data:any,@Body('servicer') servicer:string){
   return this._servicerService.addService(data,servicer)
  }   
  @Get('Service')
  GetService(){
    return this._servicerService.GetService()
  }
  @Patch('blockService')
  blockService(@Body('id') id:string,@Body('isBlocked') isBlocked:boolean ){
   return this._servicerService.blockService(id,isBlocked)
  }
  @Get('getServiceById')
  getServiceById(@Query('id') id:string){
    return this._servicerService.getServiceById(id)
  }
  @Patch('editService')
  editService(@Body('id') id:string,@Body('data') data:any){
    return this._servicerService.editService(id,data)
  }
  @Get('getUserserviceHistory')
  getUserserviceHistory(@Query('id') id:string){
    return this._servicerService.getUserserviceHistory(id)
  }
  @Patch('serviceOrderCancel')
  serviceOrderCancel(@Body() data:any){
    return this._servicerService.serviceOrderCancel(data)
  }
  @Get('servciers')
  servicer(){
    return this._servicerService.servicer()
  }
}
