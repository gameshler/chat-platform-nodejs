import { Router } from "express";
import {
  loginHandler,
  logoutHandler,
  refreshHandler,
  registerHandler,
  resetPasswordHandler,
  sendPasswordResetHandler,
  updateProfileHandler,
  verifyEmailHandler,
} from "../controllers/auth";

const authRoutes = Router();

authRoutes.post("/register", registerHandler);
authRoutes.post("/login", loginHandler);
authRoutes.get("/refresh", refreshHandler);
authRoutes.get("/logout", logoutHandler);
authRoutes.get("/email/verify/:code", verifyEmailHandler);
authRoutes.post("/password/forgot", sendPasswordResetHandler);
authRoutes.post("/password/reset", resetPasswordHandler);
authRoutes.put("/update-profile", updateProfileHandler);
export default authRoutes;
