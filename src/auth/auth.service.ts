import { HttpException, HttpStatus, Injectable, NestMiddleware, Req, Res } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { NextFunction, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { log } from 'console';


@Injectable()
export class AuthService implements NestMiddleware {
  constructor(private readonly _jwtService: JwtService) {
  
    
  }
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
   
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      console.log('u1');
      
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const token = authHeader.split(' ')[1];
    try {
      
      const decoded = this._jwtService.verify(token,{secret:process.env.secret});
  
      
    } catch (error) {  
      console.log('u2');
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
   
    next();
  }
}
