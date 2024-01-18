import * as mongoose from 'mongoose';

export const ratings_reviewSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.ObjectId, ref: 'User' },
        product: {
            type: mongoose.Schema.ObjectId,
            refPath:'itemsType',
        },

        ratings_review: [

            {
                ratings: { type: Number, required: true },
                review: { type: String, required: true }
            }
        ],
        itemsType: {
            type: String,
            enum: ['product', 'rent']
          },
        


    },
    { timestamps: true },
);  
