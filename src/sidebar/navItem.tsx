import React from "react";
import { Link } from "react-router-dom";
import { NavLinkModel } from "../modules/users/models/navLinkModel";
import { IoChevronForward } from "react-icons/io5";

interface Props {
  navLink: NavLinkModel;
  parentIndex: number;
  setNavLinks: React.Dispatch<React.SetStateAction<NavLinkModel[]>>;
  setShowLinks: React.Dispatch<React.SetStateAction<boolean>>;
}
const NavItem: React.FC<Props> = ({
  navLink,
  setShowLinks,
  setNavLinks,
  parentIndex,
}) => {
  const handleChildLinkClick = (parentIndex: number, childIndex: number) => {
    setNavLinks((prevLinks) =>
      prevLinks.map((parent, pIdx) => {
        if (pIdx !== parentIndex) return parent;

        return {
          ...parent,
          childLinks: parent.childLinks?.map((child, cIdx) => ({
            ...child,
            active: cIdx === childIndex,
          })),
        };
      })
    );
  };

  return (
    <div className="w-full flex flex-wrap justify-end items-center">
      <Link
        to={navLink.link}
        className={`navLink w-full mt-1 p-2 flex flex-wrap items-center h-fit hover:bg-blue-900 hover:text-white rounded-md ${
          navLink.active ? "bg-blue-900 text-white" : ""
        }`}
        onClick={() => setShowLinks(false)}
      >
        <span className="text-xl pr-4 flex justify-between">
          {navLink.icon}
        </span>

        <span className="flex justify-between items-center w-5/6 tracking-widest text-sm">
          {navLink.name} <IoChevronForward />
        </span>
      </Link>

      {navLink.childLinks?.map((child, index) => (
        <Link
          key={index}
          to={child.link}
          className={`navLink w-full mt-1 p-2 flex flex-wrap items-center h-fit hover:bg-blue-900 hover:text-white rounded-md ${
            navLink.childLinks && navLink.childLinks[index].active
              ? "bg-blue-900 text-white"
              : ""
          }`}
          onClick={() => {
            setShowLinks(false);
            handleChildLinkClick(parentIndex, index);
          }}
        >
          <span className="text-xl pr-4 flex justify-between">
            {child.icon}
          </span>
          <span className="flex justify-between items-center w-5/6 tracking-widest text-sm">
            {child.name}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default NavItem;
