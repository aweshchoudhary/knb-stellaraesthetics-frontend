import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const menuLinks = [
  {
    label: "Dashboard",
    link: "/dashboard",
    icon: "material-symbols:grid-view-outline-rounded",
  },
  {
    label: "Pipelines",
    link: "/pipelines",
    icon: "ph:currency-circle-dollar",
  },
  {
    label: "Activities",
    link: "/activities",
    icon: "material-symbols:date-range-outline-rounded",
  },
  {
    label: "Contacts",
    link: "/contacts",
    icon: "material-symbols:contacts-outline-rounded",
  },
  {
    label: "Items",
    link: "/products-services",
    icon: "mdi:box-outline",
  },
];
const SideBar = ({ setIsOpen, isOpen }) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState(pathname);

  useEffect(() => {
    setActive(pathname);
  }, [pathname]);
  return (
    <aside
      className={`${
        isOpen ? "w-[230px]" : "md:w-[70px] w-[230px]"
      } border-r sticky bg-bg z-50 top-0 left-0 h-screen shrink-0 transition-all`}
    >
      <header
        className={`flex items-center h-[50px] border-b ${
          isOpen ? "px-5 gap-2 justify-between" : "px-2 justify-center"
        }`}
      >
        {isOpen && <h4 className=" font-semibold">Stellar Aesthetics</h4>}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="text-2xl md:block hidden rounded-full m-0 p-1"
        >
          <Icon
            icon={
              isOpen
                ? "ic:baseline-keyboard-arrow-left"
                : "ic:baseline-keyboard-arrow-right"
            }
          />
        </button>
      </header>
      <nav className={isOpen ? "px-4 py-5" : "px-2 py-5"}>
        <ul>
          {menuLinks.map((item, i) => {
            return (
              <li key={i}>
                <Link
                  to={item.link}
                  className={`flex items-center gap-3 px-4 py-3 my-2 rounded ${
                    item.link === active
                      ? "bg-primary text-white"
                      : "hover:bg-paper"
                  }`}
                  onClick={() => setActive(item.link)}
                >
                  <Icon icon={item.icon} className="text-xl mx-auto" />
                  {isOpen && <span className="flex-1">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default SideBar;
