import { Inject } from "@nestjs/common";
import { Model } from "mongoose";

export class locationRepository {
    constructor(
      @Inject('LOCATION_MODEL')
      private _locationModel: Model<any>,
      ) {}
    async addLocation(datas:any){
        console.log(datas);
        
        const data=new this._locationModel({
            city:datas['city']
        })
        return await data.save()
    }
    async location(){
        return await this._locationModel.find()
    }
    }