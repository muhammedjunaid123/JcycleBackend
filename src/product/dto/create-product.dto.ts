import { Types } from 'mongoose';
export class CreateProductDto {
  name: string;
  brand: Types.ObjectId | string; 
  category: Types.ObjectId | string;
  price: number;
  stock: number;
  gears: string;
  brake_type: string;
  suspension: string;
  cycle_Details: string;
  image:any
}
