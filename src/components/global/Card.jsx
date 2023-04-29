import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import formatNumber from "../functions/formatNumber";
import Tooltip from "@mui/material/Tooltip";
import { Skeleton } from "@mui/material";
import { useLazyGetClientQuery } from "../../services/clientApi";
import { useLazyGetLabelQuery } from "../../services/labelApi";
import ActivityStatus from "../deal/ActivityStatus";
import moment from "moment";

const Card = ({ card }) => {
  const [label, setLabel] = useState({});
  const [clients, setClients] = useState([]);
  const [
    getClientById,
    {
      isLoading: isClientsLoading,
      isSuccess: isClientsSuccess,
      isFetching: isClientsFetching,
    },
  ] = useLazyGetClientQuery();
  const [
    getLabelById,
    {
      isLoading: isLabelLoading,
      isSuccess: isLabelSuccess,
      isFetching: isLabelFetching,
    },
  ] = useLazyGetLabelQuery();

  const fetchLabel = async (id) => {
    const { data } = await getLabelById(id);
    setLabel(data);
  };
  const fetchClient = async (id) => {
    const { data } = await getClientById(id);
    setClients((prev) => [...prev, data]);
  };

  useEffect(() => {
    let isMounted = true;
    if (card?.label) {
      isMounted && fetchLabel(card.label);
    }
    if (card?.contacts?.length) {
      card.contacts.forEach((contact) => {
        isMounted && fetchClient(contact);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [card]);

  // useEffect(() => {
  //   if (isError) toast.error(error);
  // }, [isError]);
  return card && label ? (
    <Link
      to={"/deals/" + card._id}
      className={
        "cursor-pointer w-full bg-bg text-sm relative border mb-1 p-2 flex flex-col gap-2"
      }
    >
      <div className="top">
        {!isLabelLoading && !isLabelFetching && isLabelSuccess ? (
          <Tooltip title={label.name} className="label mb-1">
            <p
              className="w-[20%] h-[5px]"
              style={{ background: label.color }}
            ></p>
          </Tooltip>
        ) : (
          <Skeleton
            variant="rectangular"
            height={5}
            sx={{ width: "20%" }}
            className="mb-1"
          />
        )}
        <h4 className="font-medium">{card.title}</h4>
        {!isClientsLoading && !isClientsFetching && isClientsSuccess ? (
          <p className="text-gray-500 text-xs flex gap-2 mt-1">
            {clients?.map((client, i) => {
              return (
                i < 2 && (
                  <span>
                    {client.contactPerson}
                    {clients.length - 1 !== i && ","}
                  </span>
                )
              );
            })}
            {clients.length > 2 && <span>{clients.length - 2} more</span>}
          </p>
        ) : (
          <p className="text-gray-500 text-xs flex gap-2 mt-1">Loading...</p>
        )}
        <div className="activity absolute top-2 right-2">
          <ActivityStatus cardId={card._id} />
        </div>
      </div>
      <div className="bottom flex items-center gap-3 text-sm">
        <div className="user">
          <Tooltip title={moment(card.createdAt).format("DD-MM-YYYY")}>
            <span>{moment(card.createdAt).fromNow()}</span>
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
