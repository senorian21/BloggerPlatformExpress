
import { sessionCollection} from "../../db/mongo.db";
import {mapToDeviceListOutput} from "../../security/mappers/map-to-device-list-output.util";

export const authQueryRepositories = {
    async deviceSessionList(userId: string) {

        const sessions = await sessionCollection.find({ userId }).toArray();

        return mapToDeviceListOutput(sessions);
    }


};
