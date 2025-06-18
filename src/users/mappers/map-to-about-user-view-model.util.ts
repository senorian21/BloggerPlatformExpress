import { WithId } from "mongodb";
import { aboutUserViewModel } from "../types/about-user-view-model";
import { UserEntity } from "../domain/user.entity";

export function mapToAboutUserViewModel(
  user: WithId<UserEntity>,
): aboutUserViewModel {
  return {
    userId: user._id.toString(),
    login: user.login,
    email: user.email,
  };
}
