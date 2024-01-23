import { Inject } from "@nestjs/common";
import { promises } from "fs";
import { Model } from "mongoose";
import { location } from "src/users/entities/user.entity";
import { ILocationRepository } from "../interfaces/location-repostiory.interface";

export class locationRepository implements ILocationRepository {
    constructor(
      @Inject('LOCATION_MODEL')
      private _locationModel: Model<any>,
      ) {}
    async addLocation(datas:any):Promise<location>{
        
        const data=new this._locationModel({
            city:datas['city']
        })
        return await data.save()
    }
    async location():Promise<location[]>{
        return await this._locationModel.find()
    }
    }