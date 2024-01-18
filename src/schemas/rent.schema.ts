import * as mongoose from 'mongoose';

export const rentSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        cycle_Details: { type: String, required: true },
        image: [{ type: String, required: true, }],
        isBlocked: { type: Boolean, default: false, required: true },
        location: { type: String, required: true },
        owner: { type: mongoose.Schema.ObjectId, ref: 'User'},
    },
    { timestamps: true },
);

