
import { Body, Controller, Post, HttpCode, HttpStatus, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

   
}
