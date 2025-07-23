import React, { useEffect, useState } from "react";
import { MdDashboard } from "react-icons/md";
import { RxActivityLog } from "react-icons/rx";
import { NavLinkModel } from "../users/models/navLinkModel";
import SideBar from "../../sidebar/sideBar";
import { UserModel } from "../users/models/userModel";
import { PiBuildingsFill } from "react-icons/pi";
import { FaHistory, FaReceipt } from "react-icons/fa";
import { TbBrandBooking } from "react-icons/tb";
import MoreUnitsList from "./MoreCondominiumsList";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { fetchCondominiumsByFacility } from "./moreFacilityCondominiumsSlice";
import { useParams } from "react-router-dom";

interface Props {}

const MoreUnitsPage: React.FC<Props> = () => {
  const { facilityId } = useParams();

  const [navLinks, setNavLinks] = useState<NavLinkModel[]>([
    {
      icon: <MdDashboard />,
      name: "Home",
      link: "/home",
      active: false,
    },

    {
      icon: <MdDashboard />,
      name: `Facility ${facilityId}`,
      link: `/facility/${facilityId}`,
      active: true,
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
      active: false,
    },
  ]);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(
      fetchCondominiumsByFacility({
        facilityId: Number(facilityId),
        page: 0,
        size: 100,
      })
    );
  }, [dispatch, facilityId]);

  // check if the user is authenticated
  useEffect(() => {
    const current_user: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    if (!current_user) {
      window.location.href = `${process.env.REACT_APP_ENTRY_APP_URL}`;
    }
  }, []);

  return (
    <div className="main flex relative w-full">
      <div className="left lg:w-1/4 w-full md:w-full left-0 right-0 fixed lg:relative text-white z-50">
        <SideBar navLinks={navLinks} setNavLinks={setNavLinks} />
      </div>
      <div className="right lg:w-full w-full h-svh px-0 lg:px-0 py-0 overflow-y-auto  mt-0 lg:mt-0">
        <div className="flex w-full h-svh lg:h-dvh mt-20 lg:mt-0 z-0 bg-gray-100">
          <MoreUnitsList />
        </div>
      </div>
    </div>
  );
};

export default MoreUnitsPage;
