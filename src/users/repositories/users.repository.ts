import { userCollection } from "../../db/mongo.db";
import { User } from "../types/user";
import { ObjectId } from "mongodb";

export const userRepository = {
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
};
