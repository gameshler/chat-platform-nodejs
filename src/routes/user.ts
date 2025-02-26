import { Router } from "express";
import { getUserHandler } from "../controllers/user";
const userRoutes = Router();
userRoutes.get("/", getUserHandler);

export default userRoutes;
