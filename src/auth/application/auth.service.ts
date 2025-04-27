import {authRepositories} from "../repositories/auth.repositories";
import argon2 from "argon2";

export const authService = {
  async isEmail(value: string) {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(value);
  },
  async findByEmail(email: string) {
      return authRepositories.findByEmail(email);
  },
  async findByLogin(Login: string) {
      return authRepositories.findByLogin(Login);
  },
    async verifyPassword (hashedPassword: string, plainPassword: string){
        const isMatch = await argon2.verify(hashedPassword, plainPassword);
        return isMatch;
    }
};
