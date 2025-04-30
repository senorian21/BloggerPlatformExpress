import { UserInput } from "../../../../src/users/dto/user.input-dto";

export function getUserDto(): UserInput {
  return {
    login: "12345",
    password: "111111",
    email: "test@test.com",
  };
}
