import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response, query } from 'express';
import { log } from 'console';
import { get } from 'http';

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
  wishlist(@Query() user:string) {
    return this.usersService.wishlist(user)
  }
  @Get('cart')
  cart(@Query() user:string) {
    return this.usersService.cart(user)
  }
  @Patch('cart')
  cartRemove(@Body() data:CreateUserDto) {
    return this.usersService.cartRemove(data)
  }
  @Patch('cartUpdate')
  cartUpdate(@Body() data:CreateUserDto) {
     console.log(data);
     
    
    return this.usersService.cartUpdate(data)
  }

  @Post('cheakout')
  addOrder(@Body() data:any){
 
     return this.usersService.addOrder(data)
  } 
  @Get('order')
  loadOrder(@Query() id:string){
    console.log(id);
    
      return this.usersService.loadOrder(id)
  }

  @Patch('orderStatus')
  orderStatusUpdate(@Body() data:any){
 
  return this.usersService.orderStatusUpdate(data)
  
  }
}
