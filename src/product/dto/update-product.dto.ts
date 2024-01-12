import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { Types } from 'mongoose';
export class UpdateProductDto extends PartialType(CreateProductDto) {
    name: string;
    brand: any; 
    category: any;
    price: number;
    stock: number;
    gears: string;
    brake_type: string;
    suspension: string;
    cycle_Details: string;
    image:String[]  
    isBlocked:boolean
}
