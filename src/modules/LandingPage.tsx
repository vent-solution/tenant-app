import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import Preloader from "../other/Preloader";
import { fetchData } from "../global/api";
import { AppDispatch } from "../app/store";
import { updateUser } from "./users/usersSlice";

const LandingPage: React.FC = () => {
  const { userId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async (id: number) => {
      try {
        const result = await fetchData(`/fetch-current-user/${id}`);

        console.log(result);
        if (!result) {
          navigate("/");
          return;
        }

        dispatch(
          updateUser({ id: String(result.data.userId), changes: result.data })
        );

        localStorage.setItem(
          "dnap-user",
          JSON.stringify({
            firstName: String(result.data.firstName),
            lastName: String(result.data.lastName),
            userId: Number(result.data.userId),
            userRole: String(result.data.userRole),
            linkedTo: Number(result.data.linkedTo),
          })
        );

        navigate("/home");
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled: ", error.message);
        } else {
          console.error("Error fetching user:", error);
        }
        navigate("/");
      }
    };

    const idNum = Number(userId);
    if (!userId || isNaN(idNum)) {
      navigate("/");
      return;
    }

    fetchCurrentUser(idNum);
  }, [userId, dispatch, navigate]);

  return (
    <div className="main flex relative w-full">
      <Preloader />
    </div>
  );
};

export default LandingPage;
