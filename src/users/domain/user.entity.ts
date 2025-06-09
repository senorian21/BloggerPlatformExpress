import mongoose from "mongoose";

export type EmailConfirmation = {
  confirmationCode: string;
  expirationDate: string;
  isConfirmed: boolean;
};

export type User = {
  login: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  emailConfirmation: EmailConfirmation;
};

const emailConfirmationSchema = new mongoose.Schema<EmailConfirmation>({
  confirmationCode: {
    type: String,
    required: true,
  },
  expirationDate: {
    type: String,
    required: true,
  },
  isConfirmed: {
    type: Boolean,
    required: true,
  },
});

const userSchema = new mongoose.Schema<User>({
  login: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  emailConfirmation: {
    type: emailConfirmationSchema,
    required: true,
  },
});

// Модель
export const UserModel = mongoose.model("user", userSchema);
