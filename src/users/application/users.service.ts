import { UserInput } from "../dto/user.input-dto";
import argon2 from "argon2";
import { User } from "../types/user";
import { userRepository } from "../repositories/users.repository";

export const userService = {
  async createUser(dto: UserInput): Promise<string> {
    const isLoginUnique = await userRepository.isLoginUnique(dto.login);
    if (!isLoginUnique) {
      return "email or login";
    }
    const isEmailUnique = await userRepository.isEmailUnique(dto.email);
    if (!isEmailUnique) {
      return "email or login";
    }
    const hashedPassword: string = await argon2.hash(dto.password,
        { type: argon2.argon2id, timeCost: 3, parallelism: 1, memoryCost: 65536 });

    /*
    свойтва для argon2
            type: argon2.argon2id, // Тип Argon2 (рекомендуется argon2id)
            memoryCost: 65536,    // 64 MB памяти
            timeCost: 3,          // 3 раунда
            parallelism: 1,       // 1 поток
            saltLength: 16,       // Длина соли (по умолчанию 16 байт)
            hashLength: 32,       // Длина хэша (по умолчанию 32 байта)
    */

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
