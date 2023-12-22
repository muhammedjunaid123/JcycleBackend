import * as mongoose from 'mongoose';

export const cartSchema = new mongoose.Schema(
    {
       user:{ type: mongoose.Schema.ObjectId, ref: 'User' },
       product:[{
           id: { type: mongoose.Schema.ObjectId, ref: 'product' },
           count: { type: Number, required: true }
       } 
    ],
    TotalAmount:{type:Number,default:0,required:true}

    },
    { timestamps: true },
);  
