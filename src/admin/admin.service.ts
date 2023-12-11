import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminRepository } from 'src/repositories/base/admin.repository';
import { UserRepository } from 'src/repositories/base/user.repository';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { UpdateProductDto } from 'src/product/dto/update-product.dto';
import { productRepository } from 'src/repositories/base/product.repository';

@Injectable()
export class AdminService {
constructor( private _adminRepository:AdminRepository,private _userRepoository:UserRepository,private _productRepository:productRepository){}

  SignIn(createAdminDto: CreateAdminDto) {
  return this._adminRepository.SignIn(createAdminDto)
  }

  findAll() {
    return `This action returns all admin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  userBlock(id: string, userData: UpdateUserDto) {
    return this._userRepoository.userBlock_and_unblock(id,userData)
  }

  productBlock(id: string, productData: UpdateProductDto) {
    return this._productRepository.productBlock_and_unblock(id,productData)
  }

  categoryBlock(id: string, categoryData: any){
    return this._productRepository.categoryblock(id,categoryData)
  }
   
  brandBlock(id: string, brandData: any){
    return this._productRepository.brandBlock(id,brandData)
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
  findAlluser() {
    return this._userRepoository.findAlluser()
  }

}
