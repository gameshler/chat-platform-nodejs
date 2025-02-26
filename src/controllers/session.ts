import { z } from "zod";
import { NOT_FOUND, OK } from "../constants/http";
import sessionModel from "../models/session";
import catchErrors from "../utils/catchErrors";
import appAssert from "../utils/appAssert";

export const getSessionHandler = catchErrors(async (req, res) => {
  const sessions = await sessionModel.find(
    {
      userId: req.userId,
      expiresAt: { $gt: new Date() },
    },
    { _id: 1, userAgent: 1, createdAt: 1 },
    {
      sort: { createdAt: -1 },
    }
  );
  return res.status(OK).json(
    sessions.map((session) => ({
      ...session.toObject(),
      ...(session.id === req.sessionId && {
        isCurrent: true,
      }),
    }))
  );
});

export const deleteSessionHandler = catchErrors(async (req, res) => {
  const sessionId = z.string().parse(req.params.id);
  const deleted = await sessionModel.findOneAndDelete({
    _id: sessionId,
    userId: req.userId,
  });
  appAssert(deleted, NOT_FOUND, "Session not found");
  return res.status(OK).json({ message: "Session removed" });
});
