import { z } from "zod";

export const messageIdSchema = z.string().min(1).max(255);
