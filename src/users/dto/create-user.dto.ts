import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,

} from 'class-validator';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  id: string

  @IsString()
  @IsNotEmpty()
  user: string

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

  
  @IsNumber()
  @IsNotEmpty()
  count: number;

  
  @IsNumber()
  @IsNotEmpty()
  price: number;

}

export class rentdto {
 
  @IsString()
  @IsNotEmpty()
  name: string

  @IsNumber()
  @IsNotEmpty()
  price: number;
 
  @IsString()
  @IsNotEmpty()
  cycle_Details: string
  
  @IsString()
  @IsNotEmpty()
  location: string

  @IsString()
  @IsNotEmpty()
  owner: string

  image:any

}
