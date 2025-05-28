export type RefreshToken = {
  tokenHash: string;
  userId: string;
  createdAt: Date;
  expiresAt?: Date;
};
