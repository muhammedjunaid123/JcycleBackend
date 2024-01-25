import * as mongoose from 'mongoose';
const DeliveryDate = new Date()
DeliveryDate.setDate(DeliveryDate.getDate() + 10)

export const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.ObjectId, ref: 'User' },

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
           default:DeliveryDate
        },
        location: {
            type: String,
        },

        status: {
            type: String,
            default: 'pending'
        },
    }]
           
       
        
       
    },
    { timestamps: true },
);  
