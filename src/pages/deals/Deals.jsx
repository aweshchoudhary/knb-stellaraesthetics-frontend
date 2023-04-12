import { lazy, useState } from "react";
import Header from "../../components/global/Header";
import { Suspense } from "react";
import Loader from "../../components/global/Loader";

const Kanban = lazy(() => import("../../components/kanban/Kanban"));
const EditKanban = lazy(() => import("../../components/kanban/EditKanban"));

const Deals = () => {
  const [isKanBanEdit, setIsKanBanEdit] = useState(false);
  return (
    <>
      <Header title={"Deals"} />
      <Suspense
        fallback={
          <section className="w-full h-screen flex items-center justify-center">
            <Loader />
          </section>
        }
      >
        {isKanBanEdit ? (
          <EditKanban setIsKanBanEdit={setIsKanBanEdit} />
        ) : (
          <Kanban setIsKanBanEdit={setIsKanBanEdit} />
        )}
      </Suspense>
    </>
  );
};

export default Deals;
