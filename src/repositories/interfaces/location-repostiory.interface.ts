import { location } from "src/users/entities/user.entity";

export interface ILocationRepository{
    addLocation(datas:any):Promise<location>;
    location():Promise<location[]>
}