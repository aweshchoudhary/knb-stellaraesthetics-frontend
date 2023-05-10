import React, { useState } from "react";
import { Suspense } from "react";
import {
  useGetPipelineQuery,
  useVerifyPipelineUserQuery,
} from "@/redux/services/pipelineApi";

import { useParams } from "react-router-dom";
import { Header, Loader } from "@/modules/common";

import { PipelineView, EditPipelineView } from "@/modules/pipeline";

const Pipeline = () => {
  const [editPipeline, setEditPipeline] = useState(false);
  const params = useParams();
  const { id } = params;
  const { data, isLoading, isFetching, refetch } = useGetPipelineQuery(id);

  const { data: checkedUser = { viewOnly: true, userRole: "assignee" } } =
    useVerifyPipelineUserQuery(id);
  console.log(checkedUser);
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
        {!checkedUser?.viewOnly && editPipeline ? (
          <EditPipelineView
            isFetching={isFetching}
            isLoading={isLoading}
            pipeline={data}
            setIsOpen={setEditPipeline}
          />
        ) : (
          <PipelineView
            isFetching={isFetching}
            isLoading={isLoading}
            pipeline={data}
            setIsOpen={setEditPipeline}
            viewOnly={checkedUser.viewOnly}
            refetchPipeline={refetch}
            viewUserRole={checkedUser.userRole}
          />
        )}
      </Suspense>
    </>
  );
};

export default Pipeline;
