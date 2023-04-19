import { lazy } from "react";
import Header from "../global/Header";
import { Suspense } from "react";
import Loader from "../global/Loader";

const Kanban = lazy(() => import("./Kanban"));

const Pipeline = () => {
  return (
    <>
      <Header title={"Pipeline"} />
      <Suspense
        fallback={
          <section className="w-full h-screen flex items-center justify-center">
            <Loader />
          </section>
        }
      >
        <Kanban />
      </Suspense>
    </>
  );
};

export default Pipeline;
