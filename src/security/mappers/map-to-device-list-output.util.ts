import { WithId } from "mongodb";
import {session} from "../../auth/types/session";
import {deviceViewModel} from "../type/device-view-model";


export function mapToDeviceListOutput(sessions: WithId<session>[]): deviceViewModel[] {
  return sessions.map((session) => ({
    ip: session.ip,
    title: session.deviceName,
    lastActiveDate: new Date(Number(session.createdAt) * 1000).toISOString(),
    deviceId: session.deviceId,
  }));
}
