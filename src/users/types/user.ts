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
      isConfirmed: boolean = false,
      confirmationCode: string = randomUUID(),
      expirationDate: Date = add(new Date(), { days: 7 })
  ) {
    this.login = login;
    this.email = email;
    this.passwordHash = hash;
    this.createdAt = new Date();
    this.emailConfirmation = {
      confirmationCode,
      expirationDate,
      isConfirmed,
    };
  }
}
