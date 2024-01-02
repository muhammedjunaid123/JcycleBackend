import * as mongoose from 'mongoose';

export const ratings_reviewSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.ObjectId, ref: 'User' },
        product: { type: mongoose.Schema.ObjectId, ref: 'product' },
        ratings_review: [

            {
                ratings: { type: Number, required: true },
                review:{type:String,required:true}
            }
        ]


    },
    { timestamps: true },
);  
