import { Droppable } from "react-beautiful-dnd";
import Card from "../global/Card";
import Row from "./Row";
import { useGetCardsByStageQuery } from "../../services/dealApi";

const Column = ({ stage, loading }) => {
  const { data, isLoading, isFetching, isSuccess } = useGetCardsByStageQuery(
    stage._id
  );
  return (
    <div className={"border-r shrink-0 flex flex-col w-1/3"} key={stage._id}>
      <header
        className={`${
          loading ? "opacity-50 " : ""
        }border-b px-3 py-1 sticky top-0 left-0 text-white bg-primary`}
      >
        <h2 className="font-medium capitalize text-sm">{stage.name}</h2>
        <p className="text-sm">
          Rs{stage.amount} - {stage.deals} Deals
        </p>
      </header>
      <div
        className={`${
          loading ? "opacity-50" : ""
        } flex-1 h-full overflow-y-auto bg-bg`}
      >
        <Droppable droppableId={stage._id} key={stage._id}>
          {(provided, snapshot) => {
            return (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`p-2 h-full ${
                  snapshot.isDraggingOver ? "bg-paper" : "bg-bg"
                }`}
              >
                {!loading &&
                  data?.map((card, index) => {
                    return (
                      <Row itemId={card._id} index={index} key={index}>
                        <Card card={card} />
                      </Row>
                    );
                  })}
                {provided.placeholder}
              </div>
            );
          }}
        </Droppable>
      </div>
    </div>
  );
};

export default Column;
