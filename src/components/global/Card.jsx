import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import useAxios from "../../hooks/useAxios";
import { useEffect, useState } from "react";
import formatNumber from "../functions/formatNumber";
import axiosInstance from "../../config/axiosInstance";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getClientById } from "../../state/features/clientSlice";
import Loader from "./Loader";
import Tooltip from "@mui/material/Tooltip";
import { Skeleton } from "@mui/material";

const Card = ({ id }) => {
  const client = useSelector((state) => state.client);
  const [card, setCard] = useState({});
  const [label, setLabel] = useState({});
  const [response, loading] = useAxios({
    method: "GET",
    url: "/api/get-card",
    config: {
      params: {
        id,
      },
    },
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (response.data) {
      setCard(response.data);
      dispatch(getClientById(response.data.clientId));
    }
  }, [response]);
  useEffect(() => {
    const fetchLabel = async (id) => {
      try {
        const { data } = await axiosInstance.get("/api/label/get-label/" + id);
        setLabel(data.data);
      } catch (err) {
        toast.error(err.response);
      }
    };
    if (card.label) {
      fetchLabel(card.label);
    }
  }, [card]);

  return !loading && card.title && client.data.contactPerson ? (
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
        <p className="text-gray-500 text-xs">{client.data.company}</p>
        <button className="activity absolute top-2 right-2 rounded-full border p-1 flex items-center justify-center hover:bg-gray-100">
          <Icon icon="icon-park-solid:caution" className="text-yellow-500" />
        </button>
      </div>
      <div className="bottom flex items-center gap-3 text-sm">
        <div className="user">
          <Tooltip title={client.data.contactPerson}>
            <Icon icon={"uil:user"} />
          </Tooltip>
        </div>
        <div className="user">
          <Tooltip title={client.data.company}>
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
      sx={{ width: "100%", my: "5px" }}
    />
  );
};

export default Card;
