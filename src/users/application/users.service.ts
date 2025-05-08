import { UserInput } from "../dto/user.input-dto";
import argon2 from "argon2";
import { User } from "../types/user";
import { userRepository } from "../repositories/users.repository";
import { argon2Service } from "../../auth/adapters/argon2.service";

export const userService = {
  async createUser(dto: UserInput): Promise<string | null> {
    const isEmailAndLoginUnique = await userRepository.isEmailAndLoginUnique(
      dto.email,
      dto.login,
    );
    if (isEmailAndLoginUnique) {
      return null;
    }
    const hashedPassword: string = await argon2Service.generateHash(
      dto.password,
    );

    const newUser = new User(dto.login, dto.email, hashedPassword);

    return userRepository.createUser(newUser);
  },

  async createUserByAdmin(dto: UserInput): Promise<string | null> {
    const isEmailAndLoginUnique = await userRepository.isEmailAndLoginUnique(
      dto.email,
      dto.login,
    );
    if (isEmailAndLoginUnique) {
      return null;
    }
    const hashedPassword: string = await argon2Service.generateHash(
      dto.password,
    );

    const newUser = new User(dto.login, dto.email, hashedPassword, true);

    return userRepository.createUser(newUser);
  },
  async deleteUser(id: string) {
    await userRepository.deleteUser(id);
  },
};
