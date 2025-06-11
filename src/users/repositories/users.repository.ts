import { User } from "../types/user";
import { ObjectId, WithId } from "mongodb";
import { ResultStatus } from "../../core/result/resultCode";
import { injectable } from "inversify";
import { UserModel } from "../domain/user.entity";
@injectable()
export class UserRepository {
  async isEmailAndLoginUnique(email: string, login: string) {
    const user = await UserModel.findOne({
      $or: [{ email: email }, { login: login }],
    });
    return user;
  }
  async createUser(newUser: User) {
    const userInstance = new UserModel(newUser);
    await userInstance.save();
    return userInstance._id.toString();
  }

  async deleteUser(id: string) {
    const result = await UserModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async findByLoginOrEmail(loginOrEmail: string): Promise<WithId<User> | null> {
    const user = await UserModel.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });
    return user;
  }

  async doesExistByLoginOrEmail(
    login: string,
    email: string,
  ): Promise<User | null> {
    const user = await UserModel.findOne({
      $or: [{ email }, { login }],
    });
    if (!user) {
      return null;
    }
    return user;
  }

  async findByCode(code: string) {
    const user = await UserModel.findOne({
      "emailConfirmation.confirmationCode": code,
    });
    return user;
  }

  async registrationConfirmationUser(user: User, userId: string) {
    const userInstance = await UserModel.findById(userId);
    if (!userInstance) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorMessage: "User not found",
        extensions: [],
      };
    }

    userInstance.emailConfirmation.isConfirmed = true;
    await userInstance.save();

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  }
  async updateConfirmationCodeAndExpiration(
    userId: string,
    newCode: string,
    newExpirationDate: Date,
  ) {
    const userInstance = await UserModel.findById(userId);
    if (!userInstance) {
      return false
    }
    userInstance.emailConfirmation.confirmationCode = newCode
    userInstance.emailConfirmation.expirationDate = newExpirationDate.toISOString()
    userInstance.save()
    return true
  }
  async updatePasswordUser(userId: string, newPasswordHash: string) {
    const userInstance = await UserModel.findById(userId);
    if (!userInstance) {
      return false
    }
    userInstance.passwordHash = newPasswordHash;
    userInstance.save()
    return true
  }
}
