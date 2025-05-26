export type session = {
    userId: string;
    createdAt: number;
    expiresAt?: number;
    deviceId: string;
    ip: string;
    deviceName: string;
};
