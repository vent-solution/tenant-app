import React, { useEffect, useState } from "react";
import { FaHistory } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { PiBuildingsFill } from "react-icons/pi";
import { RxActivityLog } from "react-icons/rx";
import Preloader from "../../other/Preloader";
import SideBar from "../../sidebar/sideBar";
import { NavLinkModel } from "../users/models/navLinkModel";
import { UserModel } from "../users/models/userModel";
import FacilitiesForSale from "./FacilitiesForSale";
import { TbBrandBooking } from "react-icons/tb";
import { FaReceipt } from "react-icons/fa6";

interface Props {}

const FacilitiesForSalePage: React.FC<Props> = () => {
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
      active: true,
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
      active: false,
    },
  ]);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // check if the user is authenticated
  useEffect(() => {
    const current_user: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );
    if (current_user) {
      setIsAuthenticated(true);
    } else {
      window.location.href = "/";
    }
  }, []);

  if (!isAuthenticated) return <Preloader />;

  return (
    <div className="main flex relative w-full">
      <div className="left lg:w-1/4 w-full md:w-full left-0 right-0 fixed lg:relative text-white z-50">
        <SideBar navLinks={navLinks} setNavLinks={setNavLinks} />
      </div>
      <div className="right lg:w-full w-full h-svh px-0 lg:px-0 py-0 overflow-y-auto  mt-0 lg:mt-0">
        <div className="flex w-full h-svh lg:h-dvh mt-20 lg:mt-0 z-0 bg-gray-100">
          <FacilitiesForSale />
        </div>
      </div>
    </div>
  );
};

export default FacilitiesForSalePage;
