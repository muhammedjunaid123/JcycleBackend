import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsBoolean,
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsString,
  
  } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString()
    @IsNotEmpty()
    name:string


  @IsString()
  @IsEmail()
  @IsNotEmpty()
  
  email: string;

  @IsNumber()
  @IsNotEmpty()
  Mobile: number;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  @IsNotEmpty()
  isBlocked:boolean

  @IsBoolean()
  @IsNotEmpty()
  isVerified:boolean

}
