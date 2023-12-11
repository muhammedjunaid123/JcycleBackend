import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { log } from 'console';

@Controller('users')
export class UsersController {
  constructor(private  usersService: UsersService) { }

  @Post('SignUp')
  async SignUp(@Body() createUserDto: CreateUserDto,@Res() res: Response) {
    return this.usersService.SignUp(createUserDto,res);
  }

  @Get('otpVerification')
  async sendMail(@Query('id') id: string, @Res() res: Response) { 
    return this.usersService.sendMail(res, id);
  }


  @Post('SignIn')
  SignIn(@Body() createUserDto: CreateUserDto,@Res() res:Response) {
    return this.usersService.signIn(createUserDto,res);
  }



  @Get('userDetails')
   findcategoryDetails(@Query('id') id: string) {      
     return this.usersService.userDetails(id);
   }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {

    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
