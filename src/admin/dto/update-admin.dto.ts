import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './create-admin.dto';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
         
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
