import { userCollection } from "../../db/mongo.db";
import { User } from "../types/user";
import {ObjectId, WithId} from "mongodb";

export const userRepository = {

  async isEmailAndLoginUnique(email: string, login:string) {
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
  async findByLoginOrEmail(
      loginOrEmail: string,
  ): Promise<WithId<User> | null> {
    const user = await userCollection.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });
    return user;
  }
};
