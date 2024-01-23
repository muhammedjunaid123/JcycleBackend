import * as mongoose from 'mongoose';

export const serviceOrderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.ObjectId, ref: 'User' },
        service: { type: mongoose.Schema.ObjectId, ref: 'service' },
        date: { type: Date, required: true },
        time: { type: String, required: true },
        totalAmount: { type: Number, required: true },
        owner: { type: mongoose.Schema.ObjectId, ref: 'servicer' },
        paymentMethod :{type:String,required:true},
        status: {
            type: String,
            default: 'pending'
        },
    },
    { timestamps: true },
);

