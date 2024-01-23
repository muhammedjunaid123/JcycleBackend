import { wishlist } from "src/users/entities/user.entity";

export interface IWishlistRepository{
    addWishlist(id: string, user: string):Promise<wishlist>;
    Wishlist(id:string):Promise<wishlist>;
}