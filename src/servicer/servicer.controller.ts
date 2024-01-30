import { Body, Controller, Get, Patch, Post, Query, Req, Res } from '@nestjs/common';
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
  @Get('getRecentUsers')
  async getRecentUsers(@Req() req: Request, @Res() res: Response) {
    return this._servicerService.getRecentUsers(res, req);
  }
  @Get('getRecentChats')
  async getRecentChats(
    @Query('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return this._servicerService.getRecentChats(id, res, req);
  }
  @Get('getMyDetails')
  async getMyDetails(@Res() res: Response, @Req() req: Request) {
    return this._servicerService.getMyDetails(res, req);
  }
  @Post('updateName')
  updateName(@Query() servcier: string, @Body() name: string) {
    return this._servicerService.updateName(servcier, name)
  }
  @Get('ServicerData')
  ServicerData(@Query('id') id:string,@Body('name') name:string){
    return this._servicerService.ServicerData(id)
  }
  @Get('serviceFilter')
  serviceFilter(@Query('time') time:string,@Query('date') date:Date,@Query('location') location:string){
    return this._servicerService.serviceFilter(time,date,location)
  }
}
