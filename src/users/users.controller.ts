import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Query, UseInterceptors, UploadedFiles, ValidationPipe, UsePipes } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, rentdto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response, query } from 'express';
import { log } from 'console';
import { get } from 'http';
import { address, rent, rentorderDetails } from './entities/user.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import path from 'path';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

  @Post('SignUp')
  async SignUp(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    return this.usersService.SignUp(createUserDto, res);
  }
  @Patch('verified')
  async verifiedUser(@Query('id') id: string) {

    return this.usersService.verified(id)
  }

  @Get('otpVerification')
  async sendMail(@Query('id') id: string, @Res() res: Response) {
    return this.usersService.sendMail(res, id);
  }


  @Post('SignIn')
  SignIn(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    return this.usersService.signIn(createUserDto, res);
  }



  @Get('userDetails')
  findcategoryDetails(@Query('id') id: string) {
    return this.usersService.userDetails(id);
  }

  @Post('cart')
  addCart(@Body() cartdata: CreateUserDto) {

    return this.usersService.addcart(cartdata)

  }
  @Post('wishlist')
  addwishlist(@Body() wishlistdata: CreateUserDto) {
    return this.usersService.addwishlist(wishlistdata)
  }

  @Get('wishlist')
  wishlist(@Query() user: string) {
    return this.usersService.wishlist(user)
  }
  @Get('cart')
  cart(@Query() user: string) {
    return this.usersService.cart(user)
  }
  @Patch('cart')
  cartRemove(@Body() data: CreateUserDto) {
    return this.usersService.cartRemove(data)
  }
  @Patch('cartUpdate')
  cartUpdate(@Body() data: CreateUserDto) {
    console.log(data);


    return this.usersService.cartUpdate(data)
  }

  @Post('cheakout')
  addOrder(@Body() data: any) {
  
    return this.usersService.addOrder(data)
  }
  @Get('order')
  loadOrder(@Query() id: string) {
    console.log(id);

    return this.usersService.loadOrder(id)
  }

  @Patch('orderStatus')
  orderStatusUpdate(@Body() data: any) {

    return this.usersService.orderStatusUpdate(data)

  }
  @Get('wallet')
  loadWallet(@Query() id: string) {
    return this.usersService.loadWallet(id)
  }
  @Post('review')
  addReview(@Body() data: any) {
    return this.usersService.addReview(data)
  }
  @Get('review')
  Review(@Query() id: string) {
    return this.usersService.Review(id)
  }
  @Get('userData')
  userData(@Query() user: string) {
    return this.usersService.userData(user)
  }
  @Post('updateName')
  updateName(@Query() user: string, @Body() name: string) {
    return this.usersService.updateName(user, name)
  }

  @Post('rent-add')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 6 }]))
  rent_add(
    @Res() res: Response,
    @Body() rent_data: rent,
    @Query('id') userId:string,
    @UploadedFiles() files: Array<Express.Multer.File>) {
    files = files['image']
    this.usersService.addrent(rent_data, files,userId,res)

  }

  @Get('loadRentBicycle')
  loadRentBicycle(@Query() data:any) {
    
    return this.usersService.loadRentBicycle(data)
  }
  @Post('address')
  addAddress(@Body('address') addressData:address,@Body('user') user:string ){
  return this.usersService.addAddress(addressData,user)
  }
  @Get('address')
  Address(@Query('id') user:string ){
  return this.usersService.Address(user)
  }
  @Get('rentDetail')
  rentDetail(@Query('id') id:string){
     return this.usersService.rentDetail(id)
  }

  @Post('rentOrder')
  addrentOrder(@Body() orderDetails:rentorderDetails){
    return this.usersService.addrentOrder(orderDetails)
  }
  @Post('addlocation')
  addlocation(@Body() data:any){
    return this.usersService.addlocation(data)
  }
  @Get('location')
  location(){
    return this.usersService.location()
  }
  @Get('rentHistory')
  rentHistory(@Query('id') id:string){
      return this.usersService.rentHistory(id)
  }
  @Get('getUserRentProduct')
  getUserRentProduct(@Query('id') id:string){
    return this.usersService.getUserRentProduct(id)
  }
  @Patch('blockRentProduct')
  blockRentProduct(@Body() productId:any){
    return this.usersService.blockRentProduct(productId)
  }
  @Patch('changeStatusRent')
  changeStatusRent(@Body() data:any ){
   return this.usersService.changeStatusRent(data)

  }
  @Get('getAllService')
  getAllService(){
    return this.usersService.getAllService()
  }
  @Post('addServiceOrder')
  addServiceOrder(@Body() data:any){
  return this.usersService.addServiceOrder(data)
  }
  @Get('getUserserviceHistory')
  getUserserviceHistory(@Query('id') id:string){
    return this.usersService.getUserserviceHistory(id)
  }
  @Patch('serviceOrderCancel')
  serviceOrderCancel(@Body() data:any){
    return this.usersService.serviceOrderCancel(data)
  }
  @Post('rentreview')
  addrentReview(@Body() data: any) {
    return this.usersService.addrentReview(data)
  }
  @Get('rentreview')
  rentReview(@Query() id: string) {
    return this.usersService.rentReview(id)
  }
  @Patch('RentimgDelete')
  imgDelete(@Body('index') index:number,@Body('id') id:string){
    console.log('enter1');
    
    return this.usersService.imgDelete(index,id)
  }
  @Patch('rentEdit')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 6 }]))
  rent_Edit(
    @Res() res: Response,
    @Body() rent_data: any,
    @Query('id') ProductId:string,
    @UploadedFiles() files: Array<Express.Multer.File>) {
      
    files = files['image']
    
    
    this.usersService.Editrent(rent_data, files,ProductId,res)

  }
  @Get('getRecentChats')
  async getRecentChats(
    @Query('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return this.usersService.getRecentChats(id, res, req);
  }
  @Get('servicerDetails')
  servicerDetails(@Query('id') id:string){
    return this.usersService.servicerDetails(id)
  }
  @Get('getAddress')
  getAddress(@Query('id') id:string,@Query('user') user:string){
    return this.usersService.getAddress(id,user)
  }
  @Patch('updateAddress')
  updateAddress(@Body('id') id:string,@Body('data') data:address,@Query('user') user:string){
    return this.usersService.updateAddress(id,data,user)
  }
  @Patch('addressDelete')
  addressDelete(@Body('user') user:string,@Body('id') id:string){
     return this.usersService.addressDelete(user,id)
  }
  @Get('getService')
  getService(@Query('id') id:string){
    return this.usersService.getService(id)
  }
 
}
