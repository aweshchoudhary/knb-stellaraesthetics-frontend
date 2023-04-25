import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import formatNumber from "../functions/formatNumber";
import { useDispatch } from "react-redux";
import Tooltip from "@mui/material/Tooltip";
import { Skeleton } from "@mui/material";
import { labelApi } from "../../services/labelApi";
import { clientApi } from "../../services/clientApi";
import ActivityStatus from "../deal/ActivityStatus";

const Card = ({ card }) => {
  const dispatch = useDispatch();
  const [label, setLabel] = useState({});
  const [client, setClient] = useState({});

  const fetchLabel = async (id) => {
    const { data } = await dispatch(labelApi.endpoints.getLabel.initiate(id));
    setLabel(data);
  };
  const fetchClient = async (id) => {
    const { data } = await dispatch(clientApi.endpoints.getClient.initiate(id));
    setClient(data);
  };

  useEffect(() => {
    if (card?.label) {
      fetchLabel(card.label);
    }
    if (card?.clientId) fetchClient(card.clientId);
  }, [card]);

  // useEffect(() => {
  //   if (isError) toast.error(error);
  // }, [isError]);

  return card && label && client ? (
    <Link
      to={"/deals/" + card._id}
      className={
        "cursor-pointer w-full bg-bg text-sm relative border mb-1 p-2 flex flex-col gap-2"
      }
    >
      <div className="top">
        {card.label && (
          <Tooltip title={label.name} className="label mb-1">
            <p
              className="w-[20%] h-[5px]"
              style={{ background: label.color }}
            ></p>
          </Tooltip>
        )}
        <h4 className="font-medium">{card.title}</h4>
        <p className="text-gray-500 text-xs">{client.company}</p>
        <div className="activity absolute top-2 right-2">
          <ActivityStatus cardId={card._id} />
        </div>
      </div>
      <div className="bottom flex items-center gap-3 text-sm">
        <div className="user">
          <Tooltip title={client.contactPerson}>
            <Icon icon={"uil:user"} />
          </Tooltip>
        </div>
        <div className="user">
          <Tooltip title={client.company}>
            <Icon icon={"uil:building"} />
          </Tooltip>
        </div>
        <div className="amount flex items-center">
          {formatNumber(card?.value?.value, {
            country: "en-IN",
            type: "INR",
          })}
        </div>
      </div>
    </Link>
  ) : (
    <Skeleton
      variant="rectangular"
      height={100}
      sx={{ width: "100%" }}
      className="mb-1"
    />
  );
};

export default Card;
