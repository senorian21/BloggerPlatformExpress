import { UserInput } from "../dto/user.input-dto";
import argon2 from "argon2";
import { User } from "../types/user";
import { userRepository } from "../repositories/users.repository";

export const userService = {
  async createUser(dto: UserInput): Promise<string> {
    const hashedPassword: string = await argon2.hash(dto.password);

    const newUser: User = {
      login: dto.login,
      email: dto.email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    return userRepository.createUser(newUser);
  },

  async deleteUser(id: string) {
    await userRepository.deleteUser(id);
  },
};
