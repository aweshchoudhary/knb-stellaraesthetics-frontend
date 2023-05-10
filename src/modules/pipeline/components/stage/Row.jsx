import React, { Suspense } from "react";
import { Draggable } from "react-beautiful-dnd";
import { DealCard } from "@/modules/deal";

const Row = ({ index, dealId, setColumnInfo }) => {
  return (
    <Suspense>
      <Draggable key={dealId} draggableId={dealId} index={index}>
        {(provided) => {
          return (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <DealCard dealId={dealId} setColumnInfo={setColumnInfo} />
            </div>
          );
        }}
      </Draggable>
    </Suspense>
  );
};

export default Row;
