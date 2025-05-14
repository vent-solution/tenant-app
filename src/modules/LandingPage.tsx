import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import Preloader from "../other/Preloader";
import { fetchData } from "../global/api";
import { AppDispatch } from "../app/store";
import { useDispatch } from "react-redux";
import { updateUser } from "./users/usersSlice";

interface Props {}

const LandingPage: React.FC<Props> = () => {
  const { userId } = useParams();

  const dispatch = useDispatch<AppDispatch>();

  // fetch current logged in user
  useEffect(() => {
    const fetchCurrentUser = async (userId: number) => {
      try {
        const result = await fetchData(`/fetch-current-user/${userId}`);

        if (!result) {
          window.location.href = "/";
          // window.location.href = "http://localhost:3000";
          return;
        }

        const updates = {
          id: String(result.data.userId),
          changes: result.data,
        };

        dispatch(updateUser(updates));

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

        window.location.href = `/home`;
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log(error.message);
        }
      }
    };

    fetchCurrentUser(Number(userId));
  }, [userId]);

  // if (isShowLandlordForm)
  //   return <LandlordForm landlord={landlord} setLandlord={setLandlord} />;

  return (
    <div className="main flex relative w-full">
      <Preloader />
    </div>
  );
};

export default LandingPage;
