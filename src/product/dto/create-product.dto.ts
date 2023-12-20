import { Types } from 'mongoose';
export class CreateProductDto {
    name: string;
  brand: Types.ObjectId | string; 
  category: Types.ObjectId | string;
  price: number;
  stock: number;
  gears: boolean;
  brake_type: boolean;
  suspension: boolean;
  cycle_Details: string;
  image:any
}
