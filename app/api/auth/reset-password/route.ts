import { createHash } from "crypto";
import { z } from "zod";
import { hash } from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { ApiError, handleApiError, noStoreJson } from "@/lib/errors";
import { enforceRateLimit, getRequestIp } from "@/lib/rate-limit";

const schema = z.object({
  token: z.string().min(32).max(256),
  newPassword: z.string().min(8).max(72),
});

export async function POST(req: Request) {
  try {
    const ip = getRequestIp(req);
    const body = await req.json();

    const parsed = schema.safeParse({
      token: String(body?.token ?? "").trim(),
      newPassword: String(body?.newPassword ?? ""),
    });

    if (!parsed.success) {
      throw new ApiError("Invalid input", 400);
    }

    const limiter = enforceRateLimit(`reset-password:${ip}`, {
      limit: 10,
      windowMs: 15 * 60 * 1000,
    });

    if (!limiter.allowed) {
      throw new ApiError(`Too many requests. Try again in ${limiter.retryAfterSec}s`, 429);
    }

    const tokenHash = createHash("sha256").update(parsed.data.token).digest("hex");

    await connectDB();

    const user = await User.findOne({
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpiresAt: { $gt: new Date() },
      isActive: true,
    });

    if (!user) {
      throw new ApiError("Reset link is invalid or expired!", 400);
    }

    user.passwordHash = await hash(parsed.data.newPassword, 12);
    user.resetPasswordTokenHash = null;
    user.resetPasswordExpiresAt = null;
    await user.save();

    return noStoreJson({ message: "Password reset successful" });
  } catch (error) {
    return handleApiError(error, "reset-password");
  }
}
