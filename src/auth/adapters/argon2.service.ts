import argon2 from "argon2";
import { injectable } from "inversify";
@injectable()
export class Argon2Service {
  async generateHash(password: string) {
    const hashedPassword: string = await argon2.hash(password, {
      type: argon2.argon2id,
      timeCost: 3,
      parallelism: 1,
      memoryCost: 65536,
      /*
            свойтва для argon2
            type: argon2.argon2id, // Тип Argon2 (рекомендуется argon2id)
            memoryCost: 65536,    // 64 MB памяти
            timeCost: 3,          // 3 раунда
            parallelism: 1,       // 1 поток
            saltLength: 16,       // Длина соли (по умолчанию 16 байт)
            hashLength: 32,       // Длина хэша (по умолчанию 32 байта)
            */
    });
    return hashedPassword;
  }
  async checkPassword(password: string, hash: string) {
    return await argon2.verify(hash, password);
  }
}
