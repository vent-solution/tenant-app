import axios from "axios";
import { setAlert } from "../../other/alertSlice";
import { SocketMessageModel } from "../../webSockets/SocketMessageModel";
import { postData } from "../api";
import { AlertTypeEnum } from "../enums/alertTypeEnum";
import { UserActivity } from "../enums/userActivity";
import { AppDispatch } from "../../app/store";
import { UserModel } from "../../modules/users/models/userModel";
import { webSocketService } from "../../webSockets/socketService";

export const logoutAction = async (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  dispatch: AppDispatch
) => {
  const user: UserModel = JSON.parse(
    localStorage.getItem("dnap-user") as string
  );
  try {
    setLoading(true);

    const result = await postData(`/log-out/${user.userId}`, {});

    if (!result) {
      dispatch(
        setAlert({
          type: AlertTypeEnum.danger,
          message: "INTERNAL SERVER ERROR!",
          status: true,
        })
      );

      return;
    }

    if (result.data.status && result.data.status !== "OK") {
      dispatch(
        setAlert({
          type: AlertTypeEnum.danger,
          message: result.data.message,
          status: true,
        })
      );

      return;
    }

    const socketMessage: SocketMessageModel = {
      userId: Number(user.userId),
      userRole: String(user.userRole),
      content: null,
      activity: UserActivity.logout,
    };

    webSocketService.sendMessage("/app/logout", socketMessage);

    window.location.href = `${process.env.REACT_APP_ENTRY_APP_URL}`;
    localStorage.removeItem("dnap-user");
  } catch (error: any) {
    if (axios.isCancel(error)) {
      console.log("REQUEST CANCELLED: ", error.message);
    }
  } finally {
    setLoading(false);
  }
};
