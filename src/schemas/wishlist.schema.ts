import * as mongoose from 'mongoose';

export const wishlistSchema = new mongoose.Schema(
    {
        user:{ type: mongoose.Schema.ObjectId, ref: 'User' },
        product:[
            {id: { type: mongoose.Schema.ObjectId, ref: 'product' }}
        ]
        

    },
    { timestamps: true },
);  
