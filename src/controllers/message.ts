import cloudinary from "../config/cloudinary";
import { getReceiverSocketId, io } from "../config/socket";
import {
  BAD_REQUEST,
  CREATED,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
} from "../constants/http";
import MessageModel from "../models/message";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";
import { messageIdSchema } from "./message.schemas";

export const getMessageHandler = catchErrors(async (req, res) => {
  const messageId = messageIdSchema.parse(req.params.id);
  const userId = req.userId;
  const messages = await MessageModel.find({
    $or: [
      { senderId: userId, receiverId: messageId },
      { senderId: messageId, receiverId: userId },
    ],
  });
  appAssert(messages, NOT_FOUND, "Message not found");
  res.status(OK).json(messages);
});

export const sendMessageHandler = catchErrors(async (req, res) => {
  const messageId = messageIdSchema.parse(req.params.id);
  const { message, image } = req.body;
  const senderId = req.userId;

  let imageUrl;
  if (image) {
    const uploadResponse = await cloudinary.uploader.upload(image);
    imageUrl = uploadResponse.secure_url;
  }
  appAssert(message || image, BAD_REQUEST, "Message or image is required");
  const newMessage = new MessageModel({
    senderId,
    receiverId: messageId,
    message,
    image: imageUrl,
  });
  await newMessage.save();
  appAssert(newMessage, INTERNAL_SERVER_ERROR, "Failed to create message");
  const receiverSocketId = getReceiverSocketId(messageId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }
  res.status(CREATED).json(newMessage);
});
