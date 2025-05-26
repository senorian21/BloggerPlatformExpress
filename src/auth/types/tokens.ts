// export type Token = {
//     userId: string;
//     deviceId: number;
//     deviceName: string;
//     ip: string;
// };

export type accessToken = {
  userId: string;
  iat?: number;
  exp?: number;
};

export type RefreshToken = {
  userId: string;
  deviceId: string;
  deviceName: string;
  ip: string;
  iat?: number;
  exp?: number;
};

export type Token = accessToken | RefreshToken;
