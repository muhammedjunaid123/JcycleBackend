import { order } from "src/users/entities/user.entity";

export interface IOrderRepository{
    addOrder(user: string, razorId: any, paymentMethod: any,location:string):Promise<order>; 
    loadOrder(user: string):Promise<order[]>;
    orderStatusUpdate(user: string, orderID: string, value: string,Total:number):Promise<order>;
}