import { mapToDeviceListOutput } from "../../security/mappers/map-to-device-list-output.util";
import { SessionModel } from "../domain/auth.entity";

export const authQueryRepositories = {
  async deviceSessionList(userId: string) {
    const sessions = await SessionModel.find({ userId });

    return mapToDeviceListOutput(sessions);
  },
};
