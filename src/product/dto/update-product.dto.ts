import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { Types } from 'mongoose';
export class UpdateProductDto extends PartialType(CreateProductDto) {
    name: string;
    brand: Types.ObjectId | string; 
    category: Types.ObjectId | string;
    price: number;
    stock: number;
    gears: boolean;
    brake_type: boolean;
    suspension: boolean;
    cycle_Details: string;
    image:String[]  
    isBlocked:boolean
}
