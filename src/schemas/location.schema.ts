import * as mongoose from 'mongoose';
const DeliveryDate = new Date()
DeliveryDate.setDate(DeliveryDate.getDate() + 10)

export const locationSchema = new mongoose.Schema(
    {
        city:[{type:String,required:true}]     
    },
    { timestamps: true },
);  
 