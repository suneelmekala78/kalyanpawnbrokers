import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["owner", "user"],
      default: "user",
      required: true,
    },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
    resetPasswordTokenHash: { type: String, default: null },
    resetPasswordExpiresAt: { type: Date, default: null },
  },
  { timestamps: true },
);

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1, isActive: 1 });

const existingUserModel = models.User;

if (existingUserModel) {
  if (!existingUserModel.schema.path("resetPasswordTokenHash")) {
    existingUserModel.schema.add({
      resetPasswordTokenHash: { type: String, default: null },
      resetPasswordExpiresAt: { type: Date, default: null },
    });
  }
}

export const User = existingUserModel || model("User", UserSchema);
