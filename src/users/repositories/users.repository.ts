import { userCollection } from "../../db/mongo.db";
import { User } from "../types/user";
import { ObjectId, WithId } from "mongodb";
import { ResultStatus } from "../../core/result/resultCode";

export const userRepository = {
  async isEmailAndLoginUnique(email: string, login: string) {
    const user = await userCollection.findOne({
      $or: [{ email: email }, { login: login }],
    });
    return user;
  },
  async createUser(newUser: User) {
    const result = await userCollection.insertOne(newUser);
    return result.insertedId.toString();
  },

  async deleteUser(id: string) {
    const deleteResult = await userCollection.deleteOne({
      _id: new ObjectId(id),
    });
    if (deleteResult.deletedCount < 1) {
      throw new Error("Post not exist");
    }
  },
  async findByLoginOrEmail(loginOrEmail: string): Promise<WithId<User> | null> {
    const user = await userCollection.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });
    return user;
  },
  async doesExistByLoginOrEmail(
    login: string,
    email: string,
  ): Promise<User | null> {
    const user = await userCollection.findOne({
      $or: [{ email }, { login }],
    });
    if (!user) {
      return null;
    }
    return user;
  },

  async findByCode(code: string) {
    const user = await userCollection.findOne({
      "emailConfirmation.confirmationCode": code,
    });
    return user;
  },

  async registrationConfirmationUser(user: User, userId: string) {
    const confirmUser = await userCollection.updateOne(
      {
        _id: new ObjectId(userId),
      },
      {
        $set: {
          "emailConfirmation.isConfirmed": true,
        },
      },
    );
    if (confirmUser.modifiedCount !== 1) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorMessage: "No changes were made to the comment",
        extensions: [],
      };
    }
    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  },
  async updateConfirmationCodeAndExpiration(
    userId: string,
    newCode: string,
    newExpirationDate: Date,
  ) {
    await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          "emailConfirmation.confirmationCode": newCode,
          "emailConfirmation.expirationDate": newExpirationDate,
        },
      },
    );
  },
};
