import { injectable } from "inversify";
import { userDocument, UserModel } from "../domain/user.entity";

@injectable()
export class UserRepository {
  async doesExistByLoginOrEmail(login: string, email: string) {
    return await UserModel.findOne({
      $or: [{ login }, { email }],
      deletedAt: null,
    });
  }

  async findByLoginOrEmail(loginOrEmail: string) {
    const user = await UserModel.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });
    return user;
  }

  async findByCode(code: string) {
    const user = await UserModel.findOne({
      "emailConfirmation.confirmationCode": code,
    });
    return user;
  }

  async save(user: userDocument) {
    await user.save();
  }
  async findById(id: string) {
    const user = await UserModel.findById(id);
    if (!user || user.deletedAt !== null) {
      return null;
    }
    return user;
  }
}
