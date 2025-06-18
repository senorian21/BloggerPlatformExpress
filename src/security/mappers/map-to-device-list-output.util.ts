import { WithId } from "mongodb";
import { deviceViewModel } from "../type/device-view-model";
import { sessionEntity } from "../../auth/domain/session.entity";

export function mapToDeviceListOutput(
  sessions: WithId<sessionEntity>[],
): deviceViewModel[] {
  return sessions.map((session) => ({
    ip: session.ip,
    title: session.deviceName,
    lastActiveDate: new Date(Number(session.createdAt) * 1000).toISOString(),
    deviceId: session.deviceId,
  }));
}
