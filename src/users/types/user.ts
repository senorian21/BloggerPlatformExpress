import { randomUUID } from "crypto";
import { add } from "date-fns/add";

export class User {
  login: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: string;
    isConfirmed: boolean;
  };

  constructor(
    login: string,
    email: string,
    hash: string,
    isConfirmed: boolean = false,
    confirmationCode: string = randomUUID(),
    expirationDate: string = add(new Date(), { days: 7 }).toISOString(),
  ) {
    this.login = login;
    this.email = email;
    this.passwordHash = hash;
    this.createdAt = new Date().toISOString();
    this.emailConfirmation = {
      confirmationCode,
      expirationDate,
      isConfirmed,
    };
  }
}
