import * as mongoose from 'mongoose';

export const Rentratings_reviewSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.ObjectId, ref: 'User' },
        product: {
            type: mongoose.Schema.ObjectId,
            ref:'rent',
        },

        ratings_review: [

            {
                ratings: { type: Number, required: true },
                review: { type: String, required: true }
            }
        ],
       
        


    },
    { timestamps: true },
);  
