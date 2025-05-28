export type session = {
  _id?: string;
  userId: string;
  createdAt: string;
  expiresAt?: string;
  deviceId: string;
  ip: string;
  deviceName: string;
};
