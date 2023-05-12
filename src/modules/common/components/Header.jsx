import React, { Suspense, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toggleDarkMode, toggleMobileOpen } from "@/redux/features/globalSlice";
import { useGetMeQuery } from "@/redux/services/userApi";
import { logOut, setCredentials } from "@/redux/features/authSlice";
import { toast } from "react-toastify";

const Header = ({ title }) => {
  const darkMode = useSelector((state) => state.global.darkMode);
  const dispatch = useDispatch();
  const { data = {}, isLoading, isFetching, isError, error } = useGetMeQuery();

  const toggleThemeMode = () => dispatch(toggleDarkMode());

  useEffect(() => {
    if (data?._id) {
      dispatch(setCredentials({ userId: data._id, name: data.fullname }));
    }
  }, [data]);

  useEffect(() => {
    if (isError && error.originalStatus === 401) {
      toast.error(error.data);
      dispatch(logOut());
    }
  }, [data]);

  return (
    <Suspense>
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
          {!isLoading && !isFetching && (
            <Link
              to={"/user/" + data._id}
              className="rounded-full h-[30px] w-[30px] border uppercase flex items-center justify-center"
            >
              <Icon icon="uil:user" />
            </Link>
          )}
        </div>
      </header>
    </Suspense>
  );
};

export default Header;
