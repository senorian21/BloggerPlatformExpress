import mongoose, {HydratedDocument} from "mongoose";

export type EmailConfirmation = {
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
};

export type User = {
  login: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  emailConfirmation: EmailConfirmation;
  deletedAt: Date;
};

export type userDocument = HydratedDocument<User>;

const emailConfirmationSchema = new mongoose.Schema<EmailConfirmation>({
  confirmationCode: {
    type: String,
    required: true,
  },
  expirationDate: {
    type: Date,
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
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  emailConfirmation: {
    type: emailConfirmationSchema,
    required: true,
  },
  deletedAt: { type: Date, default: null },
});

export const UserModel = mongoose.model("user", userSchema);
