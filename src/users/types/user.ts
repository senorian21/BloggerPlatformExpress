import { randomUUID } from "crypto";
import { add } from "date-fns/add";

export class User {
  login: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
  };

  constructor(
    login: string,
    email: string,
    hash: string,
    isAdminCreated: boolean = false,
  ) {
    this.login = login;
    this.email = email;
    this.passwordHash = hash;
    this.createdAt = new Date();
    this.emailConfirmation = {
      confirmationCode: randomUUID(),
      expirationDate: add(new Date(), {
        days: 7,
      }),
      isConfirmed: isAdminCreated,
    };
  }
}
