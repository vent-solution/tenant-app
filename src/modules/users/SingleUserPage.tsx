import React, { useEffect, useState } from "react";
import SideBar from "../../sidebar/sideBar";
import { NavLinkModel } from "./models/navLinkModel";
import { MdDashboard } from "react-icons/md";
import { FaReceipt } from "react-icons/fa6";
import { RxActivityLog } from "react-icons/rx";
import { IoDiamondSharp } from "react-icons/io5";
import { PiBuildingsFill } from "react-icons/pi";
import { UserModel } from "./models/userModel";
import UserProfileDetails from "./UserProfile";
import UserActivityList from "./UserActivityList";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoMdArrowRoundBack } from "react-icons/io";
import { TbBrandBooking } from "react-icons/tb";
import { FaHistory } from "react-icons/fa";
import { getUser } from "./usersSlice";

interface Props {}
const UsersPage: React.FC<Props> = () => {
  // LOCAL STATES
  const [navLinks, setNavLinks] = useState<NavLinkModel[]>([
    {
      icon: <MdDashboard />,
      name: "Home",
      link: "/home",
      active: false,
    },

    {
      icon: <MdDashboard />,
      name: "User",
      link: "",
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

  const [currentSection, setCurrentSection] = useState<string>("Profile");

  const navigate = useNavigate();
  const { userId } = useParams();

  const userState = useSelector(getUser);
  const { tenantUser } = userState;

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

  // render section depending on the current active link
  const renderSection = () => {
    switch (currentSection) {
      case "Profile":
        return <UserProfileDetails userId={Number(userId)} />;
      case "Activity":
        return <UserActivityList userId={Number(userId)} />;

      default:
        return <UserProfileDetails userId={Number(userId)} />;
    }
  };

  // function for selecting facility section
  const selectSection = (li: HTMLLIElement) => {
    // navigate(`/users/${userId}`);
    const { id } = li;
    const ul = li.parentElement;

    if (ul) {
      const lis = ul.querySelectorAll("li");
      lis.forEach((l) => {
        l !== li ? l.classList.remove("active") : l.classList.add("active");
      });
    }

    setCurrentSection(id);
  };

  return (
    <div className="main max-h-screen lg:overflow-hidden flex relative w-full">
      <div className="left lg:w-1/5 w-full md:w-full left-0 right-0 fixed lg:relative text-white z-50">
        <SideBar navLinks={navLinks} setNavLinks={setNavLinks} />
      </div>
      <div className="right lg:w-4/5 w-full z-0 mt-20 lg:mt-0">
        <div className="w-full flex py-0 flex-wrap justify-center items-start bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 px-2">
          <div className="w-full lg:w-full py-2 lg:pb-0 flex justify-between lg:px-10 ">
            <button
              className="bg-blue-950 hover:bg-blue-800 text-sm text-white lg:flex items-center p-1 px-3 hidden "
              onClick={() => navigate(-1)}
            >
              <IoMdArrowRoundBack />
              Back
            </button>

            {tenantUser.firstName && (
              <h2 className="text-xl font-bold">
                {"USR-" +
                  tenantUser.userId +
                  ", " +
                  tenantUser.firstName +
                  " " +
                  tenantUser.lastName}
              </h2>
            )}
          </div>
          <ul className="w-full flex flex-wrap justify-end items-center text-xs lg:text-sm text-blue-900 uppercase p-0 pt-2">
            <li
              id="Profile"
              className="active p-2 lg:px-5 lg:py-3 mt-2 font-bold border-b-2 hover:border-b-2 hover:border-red-600 cursor-pointer"
              onClick={(e: React.MouseEvent<HTMLLIElement>) =>
                selectSection(e.currentTarget)
              }
            >
              Profile details
            </li>

            <li
              id="Activity"
              className="p-2 lg:px-5 lg:py-3 mt-2 font-bold border-b-2 hover:border-b-2 hover:border-red-600 cursor-pointer"
              onClick={(e: React.MouseEvent<HTMLLIElement>) =>
                selectSection(e.currentTarget)
              }
            >
              User activity
            </li>
          </ul>
        </div>
        {renderSection()}
      </div>
    </div>
  );
};

export default UsersPage;
