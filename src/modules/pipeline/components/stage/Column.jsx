import React, { Suspense, useEffect, useMemo, useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import Row from "./Row";
import { formatNumber } from "@/modules/common";
import { useLazyGetDealsQuery } from "@/redux/services/dealApi";
import { toast } from "react-toastify";
import { Skeleton } from "@mui/material";

const Column = ({ column, columnId }) => {
  const [columnInfo, setColumnInfo] = useState({
    totalDeals: 0,
    totalRevenue: 0,
  });

  const [
    getDeals,
    { data: deals, isLoading, isFetching, isError, isSuccess, error },
  ] = useLazyGetDealsQuery();

  useMemo(() => {
    let isMounted = true;
    const fetchDeals = async () =>
      await getDeals({
        data: true,
        filters: JSON.stringify([{ id: "currentStage", value: columnId }]),
        populate: "label contacts",
      });
    isMounted && fetchDeals();
    return () => (isMounted = false);
  }, [columnId]);

  useEffect(() => {
    if (isError) toast.error(error.data?.message);
  }, [isError]);

  return (
    <Suspense>
      <div className="flex w-1/3 flex-col h-screen items-center">
        <header
          className={`border-b w-full px-3 py-2 border-r z-[99] sticky top-0 left-0 text-white bg-primary`}
        >
          <h2 className="font-medium capitalize text-sm">{column.name}</h2>
          <p className="text-sm">
            {formatNumber(columnInfo.totalRevenue)} - {columnInfo.totalDeals}{" "}
            Deals
          </p>
        </header>
        <div className="w-full flex-1 border-r">
          {!isLoading && !isFetching && isSuccess ? (
            <Droppable droppableId={columnId} key={columnId}>
              {(provided, snapshot) => {
                return (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`w-full p-2 h-full ${
                      snapshot.isDraggingOver ? "bg-paper" : "bg-bg"
                    }`}
                  >
                    {deals?.data?.length !== 0 &&
                      deals?.data?.map((deal, index) => {
                        return (
                          <Row
                            deal={deal}
                            index={index}
                            key={index}
                            setColumnInfo={setColumnInfo}
                          />
                        );
                      })}
                    {provided.placeholder}
                  </div>
                );
              }}
            </Droppable>
          ) : (
            <section className="p-2">
              <Skeleton
                variant="rectangular"
                height={100}
                sx={{ width: "100%" }}
                className="mb-1"
              />
              <Skeleton
                variant="rectangular"
                height={100}
                sx={{ width: "100%" }}
                className="mb-1"
              />
              <Skeleton
                variant="rectangular"
                height={100}
                sx={{ width: "100%" }}
                className="mb-1"
              />
              <Skeleton
                variant="rectangular"
                height={100}
                sx={{ width: "100%" }}
                className="mb-1"
              />
            </section>
          )}
        </div>
      </div>
    </Suspense>
  );
};

export default Column;
