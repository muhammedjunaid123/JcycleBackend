import * as mongoose from 'mongoose';

export const chatSchema = new mongoose.Schema(
  {
    users: [{ type: mongoose.Schema.Types.ObjectId }],
    userRead: { type: Boolean, default: false },
    professionalRead: { type: Boolean, default: false },
    messages: [
      {
        text: { type: String, required: true },
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          refPath: 'messages.senderType',
        },
        receiver: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          refPath: 'messages.receiverType',
        },
        senderType: {
          type: String,
          enum: ['User', 'servicer'],
          required: true,
        },
        receiverType: {
          type: String,
          enum: ['User', 'servicer'],
          required: true,
        },
        time: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true },
);