import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { Response, query } from 'express';
import { UpdateProductDto } from 'src/product/dto/update-product.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
//for admin signin 
  @Post('SignIn')
  SignIn(@Body() createAdminDto: CreateAdminDto,@Res() res:Response) {
    return this.adminService.SignIn(createAdminDto,res);
  }
// for get the all users
  @Get('users')
  findAll() {
    return this.adminService.findAlluser();
  }
  @Get('product')
  findAllproduct() {
    return this.adminService.findAllproduct();
  }
// 
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }
// for user block and unblock
  @Patch('userBlock')
  UserBlock(@Query('id') id: string, @Body() userData: UpdateUserDto) {
    console.log(id);
    
    return this.adminService.userBlock(id, userData);
  }

  // for product block and unblock
  @Patch('productBlock')
  productBlock(@Query('id') id: string, @Body() productData: UpdateProductDto) {
    return this.adminService.productBlock(id, productData);
  }

    // for category block and unblock
    @Patch('categoryBlock')
    categoryBlock(@Query('id') id: string, @Body() categoryData: UpdateProductDto) {
      return this.adminService.categoryBlock(id, categoryData);
    }

     // for brand block and unblock
     @Patch('brandBlock')
     brandBlock(@Query('id') id: string, @Body() categoryData: UpdateProductDto) {
       return this.adminService.brandBlock(id, categoryData);
     }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }

  @Get('')
  getRentProduct(){
   
    return this.adminService.getRentProduct()
  }
  
  @Patch('rentBlock')
  rentBlock(@Body('id') id:string,@Body('isBlocked') isBlocked:boolean){
    console.log(id);
    
   return this.adminService.rentBlock(id,isBlocked)
  }
  @Patch('serviceBlock')
  serviceBlock(@Body() data:any){
   return this.adminService.serviceBlock(data)
  }
}
