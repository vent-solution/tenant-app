import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import Preloader from "../other/Preloader";
import { fetchData } from "../global/api";
import { AppDispatch } from "../app/store";
import { updateUser } from "./users/usersSlice";
import { TenantCreationModel } from "./auth/TenantModel";
import TenantDetailsForm from "./auth/TenantDetailsForm";
import { UserStatusEnum } from "../global/enums/userStatusEnum";

const LandingPage: React.FC = () => {
  const { userId } = useParams();

  const [isShowTenantDetailsForm, setIsShowTenantDetailsForm] = useState(false);

  const [tenant, setTenant] = useState<TenantCreationModel>({
    user: {
      userId: Number(userId),
    },

    companyName: "",

    idType: "",
    nationalId: "",

    nextOfKin: {
      nokName: "",
      nokEmail: "",
      nokTelephone: "",
      nokNationalId: "",
      nokIdType: "",
      addressType: "",
      address: {
        country: "",
        state: "",
        city: "",
        county: "",
        division: "",
        parish: "",
        zone: "",
        street: "",
        plotNumber: "",
      },
    },
  });

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async (id: number) => {
      try {
        const result = await fetchData(`/fetch-current-user/${id}`);
        if (!result || (result.data.status && result.data.status !== "OK")) {
          window.location.href = `${process.env.REACT_APP_ENTRY_APP_URL}`;
          return;
        }

        if (result.data.userStatus !== UserStatusEnum.online) {
          window.location.href = `${process.env.REACT_APP_ENTRY_APP_URL}`;
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

        const tenant = await fetchData(
          `/fetch-tenant-by-user-id/${result.data.userId}`
        );
        if (!tenant) {
          window.location.href = `${process.env.REACT_APP_ENTRY_APP_URL}`;
          return;
        }

        if (tenant.data.status && tenant.data.status !== "OK") {
          setIsShowTenantDetailsForm(true);
          return;
        } else {
          navigate("/home/rent");
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled: ", error.message);
        } else {
          console.error("Error fetching user:", error);
        }
      }
    };

    const idNum = Number(userId);
    if (!userId || isNaN(idNum)) {
      window.location.href = `${process.env.REACT_APP_ENTRY_APP_URL}`;
      return;
    }

    fetchCurrentUser(idNum);
  }, [userId, dispatch, navigate]);

  if (isShowTenantDetailsForm)
    return (
      <TenantDetailsForm
        tenant={tenant}
        setTenant={setTenant}
        setIsShowTenantDetailsForm={setIsShowTenantDetailsForm}
      />
    );

  return (
    <div className="main flex relative w-full">
      <Preloader />
    </div>
  );
};

export default LandingPage;
