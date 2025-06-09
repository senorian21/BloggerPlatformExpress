import { WithId } from "mongodb";
import { aboutUserViewModel } from "../types/about-user-view-model";
import { User } from "../domain/user.entity";

export function mapToAboutUserViewModel(
  user: WithId<User>,
): aboutUserViewModel {
  return {
    userId: user._id.toString(),
    login: user.login,
    email: user.email,
  };
}
