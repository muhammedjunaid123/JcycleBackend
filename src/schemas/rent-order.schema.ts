import * as mongoose from 'mongoose';

export const rentOrderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.ObjectId, ref: 'User' },
        rentProduct: { type: mongoose.Schema.ObjectId, ref: 'rent' },
        start: { type: Date, required: true },
        end: { type: Date, required: true },
        totalAmount: { type: Number, required: true },
        owner: { type: mongoose.Schema.ObjectId, ref: 'User' },
    },
    { timestamps: true },
);

