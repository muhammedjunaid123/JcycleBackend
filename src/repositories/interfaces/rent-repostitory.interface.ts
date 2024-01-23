import { rent, rentorderDetails } from "src/users/entities/user.entity";

export interface IRentRepository {
    addrent(img: any, rent_data: rent, user: string): Promise<rent>;
    loadRentBicycle(data: any): Promise<rent[]>;
    rentDetail(id: string): Promise<rent>;
    addrentOrder(orderDetails: rentorderDetails, userid: string): Promise<rentorderDetails>;
    rentHistory(id: string): Promise<rentorderDetails[]>;
    getUserRentProduct(id: string): Promise<rent[]>;
    blockRentProduct(productID: any): Promise<rent>;
    changeStatusRent(data: any): Promise<rent>;
    getRentProduct(): Promise<rent[]>;
    rentBlock(id:string,isBlocked:boolean):Promise<rent>;
}