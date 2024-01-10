import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,

} from 'class-validator';

export class User {
  @IsString()
  @IsNotEmpty()
  name: string

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

export interface rent {
  name: string,
  price: number,
  cycle_Details: string,
  location: string,
  owner: string
}

export interface address{
  city:string,
  country:string,
  district:string, 
  fname:string,
  email:string,
  housename:string,
  lname:string,
  mobile:number,
  pin:number 
  state:string 
  }