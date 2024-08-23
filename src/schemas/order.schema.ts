import * as mongoose from 'mongoose';


export const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.ObjectId, ref: 'User' },
        Location: { type: String, required: true },
        product: [{
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product',
                required: true
            },

            count: {
                type: Number,
                required: true
            },
            DeliveryDate: {
                type: Date,
                default: new Date(new Date().setDate(new Date().getDate() + 10))

            },


            status: {
                type: String,
                default: 'pending'
            },
        }]

    },
    { timestamps: true },
);  
