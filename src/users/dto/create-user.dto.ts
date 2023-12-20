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

}
