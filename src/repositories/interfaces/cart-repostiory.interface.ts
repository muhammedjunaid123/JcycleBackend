import { cart } from "src/users/entities/user.entity";

export interface ICartRepository{
    cart(id: string):Promise<cart>;
    addCart(id: string, user: string, price: number):Promise<cart>;
    cartRemove(id: string, user: string, price: number, count: number):Promise<cart>;
    cartUpdate(user: string, id: string, count: number, price: number):Promise<cart>;
}