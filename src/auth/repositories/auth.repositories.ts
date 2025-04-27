import { userCollection } from "../../db/mongo.db";

export const authRepositories = {
  async findByEmail(email: string) {
    const user = userCollection.findOne({ email: email });
    return user;
  },
  async findByLogin(login: string) {
    const user = userCollection.findOne({ login: login });
    return user;
  },
};
