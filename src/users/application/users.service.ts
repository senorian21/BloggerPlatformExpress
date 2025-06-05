import { UserInput } from "../dto/user.input-dto";
import { User } from "../types/user";
import { UserRepository } from "../repositories/users.repository";
import { Argon2Service } from "../../auth/adapters/argon2.service";

export class UserService {
  constructor(
    public userRepository: UserRepository,
    public argon2Service: Argon2Service,
  ) {}
  async createUser(dto: UserInput): Promise<string | null> {
    const isEmailAndLoginUnique =
      await this.userRepository.isEmailAndLoginUnique(dto.email, dto.login);
    if (isEmailAndLoginUnique) {
      return null;
    }
    const hashedPassword: string = await this.argon2Service.generateHash(
      dto.password,
    );

    const newUser = new User(dto.login, dto.email, hashedPassword);

    return this.userRepository.createUser(newUser);
  }

  async createUserByAdmin(dto: UserInput): Promise<string | null> {
    const isEmailAndLoginUnique =
      await this.userRepository.isEmailAndLoginUnique(dto.email, dto.login);
    if (isEmailAndLoginUnique) {
      return null;
    }
    const hashedPassword: string = await this.argon2Service.generateHash(
      dto.password,
    );

    const newUser = new User(dto.login, dto.email, hashedPassword, true);

    return this.userRepository.createUser(newUser);
  }
  async deleteUser(id: string) {
    await this.userRepository.deleteUser(id);
  }
}
