import * as mongoose from 'mongoose';

export const categorySchema = new mongoose.Schema(
    {
        category_name: { type: String, required: true,unique:true },
        isBlocked: { type: Boolean, default: false, required: true }
    },
    { timestamps: true },
);  
