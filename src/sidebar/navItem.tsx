import React from "react";
import { Link } from "react-router-dom";
import { NavLinkModel } from "../modules/users/models/navLinkModel";
import { IoChevronForward } from "react-icons/io5";

interface Props {
  navLink: NavLinkModel;
}
const NavItem: React.FC<Props> = (navLink) => {
  return (
    <>
      <Link
        to={navLink.navLink.link}
        className={`navLink w-full mt-1 p-2 flex flex-wrap items-center h-fit hover:bg-blue-900 hover:text-white rounded-md ${
          navLink.navLink.active ? "bg-blue-900 text-white" : ""
        }`}
      >
        <span className="text-xl px-4 flex justify-between">
          {navLink.navLink.icon}
        </span>

        <span className="flex justify-between items-center w-3/4 tracking-widest text-sm">
          {navLink.navLink.name} <IoChevronForward />
        </span>
      </Link>

      {navLink.navLink.childLinks?.map((child, index) => (
        <Link
          key={index}
          to={child.link}
          className={`navLink  w-full mt-1 p-1 pl-3 font-bold flex items-center h-fit hover:bg-blue-900  hover:text-white  ${
            child.active ? "bg-blue-900 text-white " : ""
          }`}
        >
          <span className="px-3">{child.icon}</span>
          <span className="tracking-widest">{child.name}</span>
        </Link>
      ))}
    </>
  );
};

export default NavItem;
