import { WithId } from "mongodb";
import { userViewModel } from "../types/user-view-model";
import { User } from "../domain/user.entity";

export function mapToUserViewModel(user: WithId<User>): userViewModel {
  return {
    id: user._id.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
  };
}
