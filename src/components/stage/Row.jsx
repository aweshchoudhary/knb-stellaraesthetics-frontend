import { Draggable } from "react-beautiful-dnd";

const Row = ({ children, itemId, index }) => {
  return (
    <Draggable key={itemId} draggableId={itemId} index={index}>
      {(provided, snapshot) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="relative"
          >
            {children}
          </div>
        );
      }}
    </Draggable>
  );
};

export default Row;
