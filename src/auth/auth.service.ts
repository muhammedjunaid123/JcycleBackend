import { HttpStatus, Injectable, Req, Res } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';


@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService
      ) {}

  
 
}
