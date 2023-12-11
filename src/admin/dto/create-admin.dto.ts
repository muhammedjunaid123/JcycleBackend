import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateAdminDto {
 
     
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
