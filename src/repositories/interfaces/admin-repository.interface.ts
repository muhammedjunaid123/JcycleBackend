import { Response } from "express";
import { CreateAdminDto } from "src/admin/dto/create-admin.dto";

export interface IAdminRepository{
    SignIn(user: CreateAdminDto, res:Response):Promise<Response>;
}