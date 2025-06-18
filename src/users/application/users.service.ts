import { UserInput } from "../dto/user.input-dto";
import { UserRepository } from "../repositories/users.repository";
import { Argon2Service } from "../../auth/adapters/argon2.service";
import { injectable } from "inversify";
import { UserModel } from "../domain/user.entity";

@injectable()
export class UserService {
  constructor(
    public userRepository: UserRepository,
    public argon2Service: Argon2Service,
  ) {}

  async createUser(dto: UserInput): Promise<string | null> {
    const isEmailOrLoginTaken =
      await this.userRepository.doesExistByLoginOrEmail(dto.email, dto.login);
    if (isEmailOrLoginTaken) {
      return null;
    }

    const hashedPassword = await this.argon2Service.generateHash(dto.password);

    const newUser = UserModel.createUser(dto, hashedPassword);

    try {
      await newUser.save();
      return newUser.id;
    } catch (error) {
      console.error("Error saving user:", error);
      return null;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      return false;
    }

    user.softDeleteUser();
    await this.userRepository.save(user);
    return true;
  }
}
