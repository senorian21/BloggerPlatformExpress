import { WithId } from "mongodb";
import { userViewModel } from "../types/user-view-model";
import { UserEntity } from "../domain/user.entity";

export function mapToUserViewModel(user: WithId<UserEntity>): userViewModel {
  return {
    id: user._id.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
  };
}
