import * as mongoose from 'mongoose';

export const brandSchema = new mongoose.Schema(
    {
        Brand_name: { type: String, required: true,unique:true },
        isBlocked: { type: Boolean, default: false, required: true }
    },
    { timestamps: true },
);  
