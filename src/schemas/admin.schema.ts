import * as mongoose from 'mongoose';

export const adminSchema = new mongoose.Schema(
    {
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true }
    },
    { timestamps: true },
);
