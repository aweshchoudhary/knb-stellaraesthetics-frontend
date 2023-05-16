import React, { Suspense, useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import Row from "./Row";
import { formatNumber } from "@/modules/common";

const Column = ({ column, columnId }) => {
  const [columnInfo, setColumnInfo] = useState({
    totalDeals: 0,
    totalRevenue: 0,
  });
  return (
    <Suspense>
      <div className="flex w-1/3 flex-col h-screen items-center">
        <header
          className={`border-b w-full px-3 py-2 border-r sticky top-0 left-0 text-white bg-primary`}
        >
          <h2 className="font-medium capitalize text-sm">{column.name}</h2>
          <p className="text-sm">
            {formatNumber(columnInfo.totalRevenue)} - {columnInfo.totalDeals}{" "}
            Deals
          </p>
        </header>
        <div className="w-full flex-1 border-r">
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
                  {column.deals.map((dealId, index) => {
                    return (
                      <Row
                        dealId={dealId}
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
        </div>
      </div>
    </Suspense>
  );
};

export default Column;
