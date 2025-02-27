import { NOT_FOUND, OK } from "../constants/http";
import UserModel from "../models/user";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";

export const getUserHandler = catchErrors(async (req, res) => {
  const user = await UserModel.findById(req.userId);
  appAssert(user, NOT_FOUND, "User not found");
  return res.status(OK).json({ user: user.omitPassword() });
});
export const getUsersHandler = catchErrors(async (req, res) => {
  const userId = req.userId;
  const users = await UserModel.find({ _id: { $ne: userId } });
  appAssert(users, NOT_FOUND, "Users not found");
  return res.status(OK).json(users.map((user) => user.omitPassword()));
});
