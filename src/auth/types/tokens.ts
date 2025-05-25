// export type Token = {
//     userId: string;
//     deviceId: number;
//     deviceName: string;
//     ip: string;
// };

export type accessToken = {
  userId: string;
  iat: string;
  exp: string;
};

export type RefreshToken = {
  userId: string;
  deviceId: string;
  deviceName: string;
  ip: string;
};

export type Token = accessToken | RefreshToken;
