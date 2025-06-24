import React, { useEffect, useState } from "react";
import { FaHistory } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { RxActivityLog } from "react-icons/rx";
import SideBar from "../../sidebar/sideBar";
import { NavLinkModel } from "../users/models/navLinkModel";
import LogsList from "./LogsList";
import { PiBuildingsFill } from "react-icons/pi";
import { UserModel } from "../users/models/userModel";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { fetchLogs } from "./LogsSlice";
import { TbBrandBooking } from "react-icons/tb";
import { FaReceipt } from "react-icons/fa6";
import { getUser } from "../users/usersSlice";

interface Props {}

const LogsPage: React.FC<Props> = () => {
  // LOCAL STATES
  const [navLinks, setNavLinks] = useState<NavLinkModel[]>([
    {
      icon: <MdDashboard />,
      name: "Home",
      link: "/home",
      active: false,
    },

    {
      icon: <PiBuildingsFill />,
      name: "Facilities for sale",
      link: "/facilitiesForSale",
      active: false,
    },

    {
      icon: <PiBuildingsFill />,
      name: "My Accommodations",
      link: "/accommodations",
      active: false,
    },

    {
      icon: <TbBrandBooking />,
      name: "Bookings",
      link: "/bookings",
      active: false,
    },

    {
      icon: <FaHistory />,
      name: "History",
      link: "/history",
      active: false,
    },

    // {
    //   icon: <IoDiamondSharp />,
    //   name: "Broker fees",
    //   link: "/brokerFees",
    //   active: false,
    // },

    {
      icon: <FaReceipt />,
      name: "Receipts",
      link: "/receipts",
      active: false,
    },

    {
      icon: <RxActivityLog />,
      name: "Activity Logs",
      link: "/logs",
      active: true,
    },
  ]);

  const dispatch = useDispatch<AppDispatch>();

  const tenantUserState = useSelector(getUser);

  const { tenantUser, status } = tenantUserState;

  const statusR = status;

  /*
   *create a delay of 3sec and check authication
   * to proceed to page or go back to login page
   */
  useEffect(() => {
    const currentUser = localStorage.getItem("dnap-user");
    if (!currentUser) {
      window.location.href = `${process.env.REACT_APP_ENTRY_APP_URL}`;
    }
  }, []);

  // fetch user logs
  useEffect(() => {
    const user: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    dispatch(fetchLogs({ userId: [Number(user?.userId)], page: 0, size: 25 }));
  }, [dispatch]);

  return (
    <div className="main flex relative w-full">
      <div className="left lg:w-1/5 w-full md:w-full left-0 right-0 fixed lg:relative text-white z-50">
        <SideBar navLinks={navLinks} setNavLinks={setNavLinks} />
      </div>
      <div className="right lg:w-4/5 w-full z-0">
        <LogsList />
      </div>
    </div>
  );
};

export default LogsPage;
