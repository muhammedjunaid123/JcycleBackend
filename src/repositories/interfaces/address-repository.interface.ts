import { address } from "src/users/entities/user.entity";

export interface IAddressRepository {
    addAddress(user: string, addressData: address):Promise<address>;
    Address(user:string):Promise<address>;
}