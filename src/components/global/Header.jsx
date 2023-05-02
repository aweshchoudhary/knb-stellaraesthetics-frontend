import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  toggleDarkMode,
  toggleMobileOpen,
} from "../../redux/features/globalSlice";
import React from "react";

const Header = ({ title }) => {
  const darkMode = useSelector((state) => state.global.darkMode);
  const picture = useSelector((state) => state.auth?.user?.profile?.picture);
  const dispatch = useDispatch();

  const toggleThemeMode = () => dispatch(toggleDarkMode());
  return (
    <header className="px-5 h-[50px] border-b flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={() => dispatch(toggleMobileOpen())}
          className="btn text-2xl md:hidden block"
        >
          <Icon icon={"uil:bars"} />
        </button>
        <h1 className="font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button className="rounded-full text-xl" onClick={toggleThemeMode}>
          <Icon
            icon={
              darkMode ? "ic:round-light-mode" : "material-symbols:dark-mode"
            }
          />
        </button>
        <Link className="block rounded-full">
          <Icon icon="basil:user-plus-outline" className="text-xl" />
        </Link>
        <Link
          to="/user"
          className="rounded-full h-[30px] w-[30px] border uppercase"
        >
          {picture && (
            <img
              src={picture}
              className="w-full rounded-full h-full object-cover"
              width={50}
              height={50}
            />
          )}
        </Link>
      </div>
    </header>
  );
};

export default Header;
