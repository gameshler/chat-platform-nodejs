import cloudinary from "../config/cloudinary";
import { CLIENT_URL } from "../constants/env";
import {
  BAD_REQUEST,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  TOO_MANY_REQUESTS,
  UNAUTHORIZED,
} from "../constants/http";
import verificationCodeType from "../constants/verificationCodeTypes";
import sessionModel from "../models/session";
import UserModel from "../models/user";
import verificationCodeModel from "../models/verificationCode";
import appAssert from "../utils/appAssert";
import { hashValue } from "../utils/bcrypt";
import {
  fiveMinutesAgo,
  ONE_DAY_MS,
  oneHourFromNow,
  oneYearFromNow,
  thirtyDaysFromNow,
} from "../utils/date";
import {
  getPasswordResetTemplate,
  getVerifyEmailTemplate,
} from "../utils/emailTemplates";

import {
  RefreshTokenPayload,
  refreshTokenSignOptions,
  signToken,
  verifyToken,
} from "../utils/jwt";
import { sendMail } from "../utils/sendMail";

type CreateAccountParams = {
  username: string;
  email: string;
  password: string;
  userAgent?: string;
};

export const createAccount = async (data: CreateAccountParams) => {
  const existingUser = await UserModel.exists({ email: data.email });

  appAssert(!existingUser, CONFLICT, "Email already exists");

  const user = await UserModel.create({
    username: data.username,
    email: data.email,
    password: data.password,
  });

  const userId = user._id;

  const verificationCode = await verificationCodeModel.create({
    userId,
    type: verificationCodeType.EmailVerification,
    expiresAt: oneYearFromNow(),
  });

  const url = `${CLIENT_URL}/email/verify/${verificationCode._id}`;

  const { error } = await sendMail({
    to: user.email,
    ...getVerifyEmailTemplate(url),
  });

  if (error) {
    console.log(error);
  }

  const session = await sessionModel.create({
    userId,
    userAgent: data.userAgent,
  });

  const refreshToken = signToken(
    {
      sessionId: session._id,
    },
    refreshTokenSignOptions
  );

  const accessToken = signToken({
    userId,
    sessionId: session._id,
  });

  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};
type LoginParams = {
  email: string;
  password: string;
  userAgent?: string;
};
export const loginUser = async ({
  email,
  password,
  userAgent,
}: LoginParams) => {
  const user = await UserModel.findOne({ email });
  appAssert(user, UNAUTHORIZED, "Invalid email or password");
  const isValid = await user.comparePassword(password);
  appAssert(isValid, UNAUTHORIZED, "Invalid email or password");
  const userId = user._id;
  const session = await sessionModel.create({
    userId,
    userAgent,
  });
  const sessionInfo: RefreshTokenPayload = {
    sessionId: session._id,
  };
  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);

  const accessToken = signToken({
    ...sessionInfo,
    userId,
  });

  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

export const refreshUserAccessToken = async (refreshToken: string) => {
  const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
    secret: refreshTokenSignOptions.secret,
  });
  appAssert(payload, UNAUTHORIZED, "Invalid refresh token");
  const session = await sessionModel.findById(payload.sessionId);
  const now = Date.now();
  appAssert(
    session && session.expiresAt.getTime() > now,
    UNAUTHORIZED,
    "Session Expired"
  );

  const sessionNeedsRefresh = session.expiresAt.getTime() - now <= ONE_DAY_MS;
  if (sessionNeedsRefresh) {
    session.expiresAt = thirtyDaysFromNow();
    await session.save();
  }

  const newRefreshToken = sessionNeedsRefresh
    ? signToken(
        {
          sessionId: session._id,
        },
        refreshTokenSignOptions
      )
    : undefined;

  const accessToken = signToken({
    userId: session.userId,
    sessionId: session._id,
  });

  return {
    accessToken,
    newRefreshToken,
  };
};

export const verifyEmail = async (code: string) => {
  const validCode = await verificationCodeModel.findOne({
    _id: code,
    type: verificationCodeType.EmailVerification,
    expiresAt: { $gt: new Date() },
  });
  appAssert(validCode, NOT_FOUND, "Invalid or Expired verification code");
  const updatedUser = await UserModel.findByIdAndUpdate(
    validCode.userId,
    {
      verified: true,
    },
    { new: true }
  );
  appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to verify email");
  await validCode.deleteOne();
  return {
    user: updatedUser.omitPassword(),
  };
};

export const sendPasswordResetEmail = async (email: string) => {
  try {
    const user = await UserModel.findOne({ email });
    appAssert(user, NOT_FOUND, "User not found");
    const fiveMinAgo = fiveMinutesAgo();
    const count = await verificationCodeModel.countDocuments({
      userId: user._id,
      type: verificationCodeType.PasswordReset,
      createdAt: { $gt: fiveMinAgo },
    });
    appAssert(
      count <= 1,
      TOO_MANY_REQUESTS,
      "Too many requests,please try again later"
    );
    const expiresAt = oneHourFromNow();
    const verificationCode = await verificationCodeModel.create({
      userId: user._id,
      type: verificationCodeType.PasswordReset,
      expiresAt,
    });
    const url = `${CLIENT_URL}/password/reset?code=${
      verificationCode._id
    }&exp=${expiresAt.getTime()}`;

    const { data, error } = await sendMail({
      to: user.email,
      ...getPasswordResetTemplate(url),
    });
    appAssert(
      data?.id,
      INTERNAL_SERVER_ERROR,
      `${error?.name} - ${error?.message}`
    );

    return {
      url,
      emailId: data.id,
    };
  } catch (error: any) {
    console.log("SendPasswordResetError:", error.message);
    return {};
  }
};

type ResetPasswordParams = {
  password: string;
  verificationCode: string;
};

export const resetPassword = async ({
  password,
  verificationCode,
}: ResetPasswordParams) => {
  const validCode = await verificationCodeModel.findOne({
    _id: verificationCode,
    type: verificationCodeType.PasswordReset,
    expiresAt: { $gt: new Date() },
  });
  appAssert(validCode, NOT_FOUND, "Invalid or Expired verification code");
  const updatedUser = await UserModel.findByIdAndUpdate(validCode.userId, {
    password: await hashValue(password),
  });
  appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to reset password");
  await validCode.deleteOne();
  await sessionModel.deleteMany({ userId: updatedUser._id });
  return {
    user: updatedUser.omitPassword(),
  };
};

type UpdateProfilePicParams = {
  email: string;
  profilePic: string;
};

export const updateProfilePic = async ({
  email,
  profilePic,
}: UpdateProfilePicParams) => {
  const user = await UserModel.findOne({ email });
  const userId = user?._id;
  appAssert(userId, NOT_FOUND, "User not found");
  const uploadResponse = await cloudinary.uploader.upload(profilePic);
  appAssert(uploadResponse, BAD_REQUEST, "Failed to upload image");
  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    { profilePic: uploadResponse.secure_url },
    { new: true, runValidators: true }
  );
  return {
    user: updatedUser?.omitPassword(),
  };
};
