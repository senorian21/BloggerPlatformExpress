import argon2 from "argon2";
import {userRepository} from "../../users/repositories/users.repository";
import {User} from "../../users/types/user";

export const authService = {

    async verifyPassword (hashedPassword: string, plainPassword: string){
        const isMatch = await argon2.verify(hashedPassword, plainPassword);
        return isMatch;
    },

    async checkUserloginOrEmail(
        loginOrEmail: string,
    ): Promise<User | null>  {
        return await userRepository.findByLoginOrEmail(loginOrEmail);
    },
};
