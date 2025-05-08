import { UserActivity } from "../../global/enums/userActivity";
import {
  fetchAccommodationOnCheckIn,
  deleteAccommodation,
} from "../../modules/accommodations/tenantAccommodationsSlice";

import {
  addNewUnit,
  deleteUnit,
  updateUnit,
} from "../../modules/home/unitsSlice";
import { webSocketService } from "../socketService";

export const accommodationsTopicSubscription = (dispatch: any) => {
  webSocketService.subscribe("/topic/accommodations", (message) => {
    const content = JSON.parse(JSON.stringify(message.content));

    if (message.activity === UserActivity.addAccommodation) {
      dispatch(addNewUnit(content));
    }

    if (message.activity === UserActivity.updateAccommodation) {
      dispatch(updateUnit(content));
    }

    if (message.activity === UserActivity.deleteAccommodation) {
      dispatch(deleteUnit(content));
    }

    if (message.activity === UserActivity.checkInTenant) {
      dispatch(
        fetchAccommodationOnCheckIn({
          accommodationId: Number(content.accommodationId),
          tenantId: Number(content.tenantId),
          status: content.status,
        })
      );
    }

    if (message.activity === UserActivity.checkOutTenant) {
      dispatch(deleteAccommodation(content));
    }
  });
};
