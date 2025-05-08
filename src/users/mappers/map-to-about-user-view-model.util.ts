import { WithId } from "mongodb";
import { userViewModel } from "../types/user-view-model";
import { User } from "../types/user";
import { aboutUserViewModel } from "../types/about-user-view-model";

export function mapToAboutUserViewModel(
  user: WithId<User>,
): aboutUserViewModel {
  return {
    userId: user._id.toString(),
    login: user.login,
    email: user.email,
  };
}
