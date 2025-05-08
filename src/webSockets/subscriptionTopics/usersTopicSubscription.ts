import { logoutAction } from "../../global/actions/logoutAction";
import { UserActivity } from "../../global/enums/userActivity";
import { UserRoleEnum } from "../../global/enums/userRoleEnum";
import { deleteUnitsByLandlord } from "../../modules/home/unitsSlice";
import { webSocketService } from "../socketService";
import { UserModel } from "../../modules/users/models/userModel";

export const usersTopicSubscription = (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  dispatch: any
) => {
  const currentUser: UserModel = JSON.parse(
    localStorage.getItem("dnap-user") as string
  );

  webSocketService.subscribe("/topic/users", (message) => {
    console.log(message);

    const content = JSON.parse(JSON.stringify(message.content));

    if (
      message.activity === UserActivity.blockUser &&
      content.userRole === UserRoleEnum.landlord
    ) {
      dispatch(deleteUnitsByLandlord(Number(content.userId)));
    }

    if (content.userId === currentUser.userId) {
      logoutAction(currentUser, setLoading, dispatch);
    }
  });
};
