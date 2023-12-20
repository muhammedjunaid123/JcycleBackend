import * as mongoose from 'mongoose';

export const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        brand:{  type: mongoose.Schema.ObjectId, ref: 'brand' },
        category:{type:mongoose.Schema.ObjectId, ref:'category'},
        price:{ type:Number,required:true },
        stock :{ type:Number,required:true },
        gears:{type:Boolean,required:true},
        brake_type:{type:Boolean,required:true},
        suspension:{type:Boolean,required:true},
        cycle_Details: { type: String, required: true },
        image:[{type:String,required:true,}],
        isBlocked: { type: Boolean, default: false, required: true },
        wished:{type:Boolean,default:false,required:true}


    },
    { timestamps: true },
);  
