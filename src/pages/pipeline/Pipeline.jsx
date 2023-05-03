import React, { lazy, useState } from "react";
import Header from "../../components/global/Header";
import { Suspense } from "react";
import Loader from "../../components/global/Loader";
import { useGetPipelineQuery } from "../../redux/services/pipelineApi";
import { useParams } from "react-router-dom";

const Kanban = lazy(() => import("../../components/pipeline/Kanban"));
const EditKanban = lazy(() => import("../../components/pipeline/EditKanban"));

const Pipeline = () => {
  const [editPipeline, setEditPipeline] = useState(false);
  const params = useParams();
  const { id } = params;
  const { data, isLoading, isFetching } = useGetPipelineQuery(id);
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
          <EditKanban
            isFetching={isFetching}
            isLoading={isLoading}
            pipeline={data}
            setIsOpen={setEditPipeline}
          />
        ) : (
          <Kanban
            isFetching={isFetching}
            isLoading={isLoading}
            pipeline={data}
            setIsOpen={setEditPipeline}
          />
        )}
      </Suspense>
    </>
  );
};

export default Pipeline;