import { lazy, useState } from "react";
import Header from "../components/global/Header";
import { Suspense } from "react";
import Loader from "../components/global/Loader";

const Kanban = lazy(() => import("../components/pipeline/Kanban"));
const EditKanban = lazy(() => import("../components/pipeline/EditKanban"));

const Pipeline = () => {
  const [editPipeline, setEditPipeline] = useState(false);
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
        {editPipeline ? (
          <EditKanban setIsOpen={setEditPipeline} />
        ) : (
          <Kanban setIsOpen={setEditPipeline} />
        )}
      </Suspense>
    </>
  );
};

export default Pipeline;
