import React, { Suspense } from "react";
import { Draggable } from "react-beautiful-dnd";
import { DealCard } from "@/modules/deal";

const Row = ({ index, deal, setColumnInfo }) => {
  return (
    <Suspense>
      <Draggable key={deal._id} draggableId={deal._id} index={index}>
        {(provided) => {
          return (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <DealCard deal={deal} setColumnInfo={setColumnInfo} />
            </div>
          );
        }}
      </Draggable>
    </Suspense>
  );
};

export default Row;
