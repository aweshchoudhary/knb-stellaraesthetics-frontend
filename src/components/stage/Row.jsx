import React from "react";
import { Draggable } from "react-beautiful-dnd";
import Deal from "../global/Deal";

const Row = ({ index, dealId, setColumnInfo }) => {
  return (
    <Draggable key={dealId} draggableId={dealId} index={index}>
      {(provided) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Deal dealId={dealId} setColumnInfo={setColumnInfo} />
          </div>
        );
      }}
    </Draggable>
  );
};
// const Row = ({ children, itemId, index }) => {
//   return (
//     <Draggable key={itemId} draggableId={itemId} index={index}>
//       {(provided, snapshot) => {
//         return (
//           <div
//             ref={provided.innerRef}
//             {...provided.draggableProps}
//             {...provided.dragHandleProps}
//             className="relative"
//           >
//             {children}
//           </div>
//         );
//       }}
//     </Draggable>
//   );
// };

export default Row;
