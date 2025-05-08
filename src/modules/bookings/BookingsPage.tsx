import React, { useEffect, useState } from "react";
import { MdDashboard } from "react-icons/md";
import { RxActivityLog } from "react-icons/rx";
import Preloader from "../../other/Preloader";
import SideBar from "../../sidebar/sideBar";
import { NavLinkModel } from "../users/models/navLinkModel";
import { PiBuildingsFill } from "react-icons/pi";
import { FaHistory } from "react-icons/fa";
import BookingsList from "./BookingsList";
import { TbBrandBooking } from "react-icons/tb";
import { IoDiamondSharp } from "react-icons/io5";
import { FaReceipt } from "react-icons/fa6";

interface Props {}

const BookingsPage: React.FC<Props> = () => {
  // LOCAL STATES
  const [navLinks] = useState<NavLinkModel[]>([
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
      active: true,
    },

    {
      icon: <FaHistory />,
      name: "History",
      link: "/history",
      active: false,
    },

    {
      icon: <IoDiamondSharp />,
      name: "Broker fees",
      link: "/brokerFees",
      active: false,
    },

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

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /*
   *create a delay of 3sec and check authication
   * to proceed to page or go back to login page
   */
  useEffect(() => {
    const currentUser = localStorage.getItem("dnap-user");
    if (currentUser) {
      setIsAuthenticated(true);
    } else {
      window.location.href = "/";
    }
  }, []);

  // render preloader screen if not authenticated or page still loading
  if (!isAuthenticated) {
    return <Preloader />;
  }

  return (
    <div className="main flex relative w-full">
      <div className="left lg:w-1/5 w-full md:w-full left-0 right-0 fixed lg:relative text-white z-50">
        <SideBar navLinks={navLinks} />
      </div>
      <div className="right lg:w-4/5 w-full z-0">
        <BookingsList />
      </div>
    </div>
  );
};

export default BookingsPage;
