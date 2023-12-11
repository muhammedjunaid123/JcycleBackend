import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsString,
  
  } from 'class-validator';

export class User {
    @IsString()
    @IsNotEmpty()
    name:string

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  
  email: string;

  @IsNumber()
  @IsNotEmpty()
  phone: number;

  @IsString()
  @IsNotEmpty()
  password: string;
}
