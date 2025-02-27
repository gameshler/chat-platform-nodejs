import mongoose from "mongoose";

export interface MessageDocument extends mongoose.Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  message: string;
  image: string;
}

const messageSchema = new mongoose.Schema<MessageDocument>(
  {
    senderId: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    receiverId: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    message: { type: String },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

const MessageModel = mongoose.model<MessageDocument>("Message", messageSchema);
export default MessageModel;
