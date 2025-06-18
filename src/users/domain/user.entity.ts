import mongoose, { HydratedDocument, model, Model } from "mongoose";
import { randomUUID } from "crypto";
import { add } from "date-fns/add";
import { UserInput } from "../dto/user.input-dto";

export type EmailConfirmation = {
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
};

export class UserEntity {
  constructor(
    public login: string,
    public email: string,
    public passwordHash: string,
    public createdAt: Date,
    public emailConfirmation: EmailConfirmation,
    public deletedAt: Date,
  ) {}
  static createUser(dto: UserInput, hashedPassword: string) {
    const newUser = new UserModel();
    newUser.login = dto.login;
    newUser.email = dto.email;
    newUser.passwordHash = hashedPassword;
    newUser.createdAt = new Date();
    newUser.emailConfirmation = {
      confirmationCode: randomUUID(),
      expirationDate: add(new Date(), { days: 7 }),
      isConfirmed: false,
    };
    return newUser;
  }
  softDeleteUser() {
    this.deletedAt = new Date();
  }
  registrationConfirmationUser() {
    this.emailConfirmation.isConfirmed = true;
  }
  updateCodeAndExpirationDate(
    newConfirmationCode: string,
    newExpirationDate: Date,
  ) {
    this.emailConfirmation.confirmationCode = newConfirmationCode;
    this.emailConfirmation.expirationDate = newExpirationDate;
  }
  updatePassword(hashedPassword: string) {
    this.passwordHash = hashedPassword;
  }
}

interface userMethods {
  softDeleteUser(): void;
  registrationConfirmationUser(): void;
  updatePassword(hashedPassword: string): void;
}

type userStatic = typeof UserEntity;

type userModelType = Model<UserEntity, {}, userMethods> & userStatic;

export type userDocument = HydratedDocument<UserEntity, userMethods>;

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

const userSchema = new mongoose.Schema<UserEntity>({
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

userSchema.loadClass(UserEntity);

export const UserModel = model<UserEntity, userModelType>("user", userSchema);
