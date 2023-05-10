import React, { Suspense, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { SideBar, Loader } from "@/modules/common";

const Layout = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const darkMode = useSelector((state) => state.global.darkMode);
  useEffect(() => {
    Boolean(darkMode)
      ? document.documentElement &&
        document.documentElement.classList.add("darkMode")
      : document.documentElement.classList.remove("darkMode");
  }, [darkMode]);
  return (
    <div className="flex relative w-screen h-screen">
      <SideBar setIsOpen={setIsSideBarOpen} isOpen={isSideBarOpen} />
      <main>
        <article
          className={`${
            isSideBarOpen ? "w-[calc(100vw-230px)]" : "w-[calc(100vw-70px)]"
          } h-full overflow-y-auto`}
        >
          <Suspense
            fallback={
              <section className="h-screen w-full flex items-center justify-center">
                <Loader />
              </section>
            }
          >
            <Outlet />
          </Suspense>
        </article>
      </main>
    </div>
  );
};

export default Layout;
