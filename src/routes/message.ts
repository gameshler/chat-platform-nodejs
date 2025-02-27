import { Router } from "express";
import { getMessageHandler, sendMessageHandler } from "../controllers/message";
const messageRoutes = Router();

messageRoutes.get("/:id", getMessageHandler);
messageRoutes.post("/send/:id", sendMessageHandler);

export default messageRoutes;
