import { Router } from "express";
import { getUserHandler, getUsersHandler } from "../controllers/user";
const userRoutes = Router();
userRoutes.get("/", getUserHandler);
userRoutes.get("/users", getUsersHandler);

export default userRoutes;
