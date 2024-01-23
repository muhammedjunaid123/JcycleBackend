import * as mongoose from 'mongoose';

export const serviceSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        date: { type: Date, required: true },
        time: { type: String, required: true },
        isBlocked: { type: Boolean, default: false, required: true },
        isBooked: { type: Boolean, default: false, required: true },
        location: { type: String, required: true },
        owner: { type: mongoose.Schema.ObjectId, ref: 'servicer'},
        service_Details:{type:String,required:true}
    },
    { timestamps: true },
);

