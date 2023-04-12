import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import useAxios from "../../hooks/useAxios";
import { useEffect, useState } from "react";
import formatNumber from "../functions/formatNumber";
import axiosInstance from "../../config/axiosInstance";
import { toast } from "react-toastify";

const Card = ({ id }) => {
  const [card, setCard] = useState({});
  const [label, setLabel] = useState({});
  const [response, error, loading, refetch] = useAxios({
    method: "GET",
    url: "/api/get-card",
    config: {
      params: {
        id,
      },
    },
  });

  useEffect(() => {
    if (response.data) {
      setCard(response.data);
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
    console.log(card.label);
  }, [card]);
  return card && card.clientDetails ? (
    <Link
      to={"/deals/" + card._id}
      className={
        "cursor-pointer w-full bg-bg text-sm relative border mb-1 p-2 flex flex-col gap-2"
      }
    >
      <div className="top">
        {card.label && (
          <div className="label mb-1">
            <p
              className="w-[20%] h-[5px]"
              style={{ background: label.color }}
            ></p>
          </div>
        )}
        <h4 className="font-medium">{card.clientDetails?.title}</h4>
        <p className="text-gray-500 text-xs">{card.clientDetails.company}</p>
        <button className="activity absolute top-2 right-2 rounded-full border p-1 flex items-center justify-center hover:bg-gray-100">
          <Icon icon="icon-park-solid:caution" className="text-yellow-500" />
        </button>
      </div>
      <div className="bottom flex items-center gap-3 text-sm">
        <div className="user" title={card.clientDetails.contactPerson}>
          <Icon icon={"uil:user"} />
        </div>
        <div className="amount flex items-center">
          {formatNumber(card?.value.value, {
            country: "en-IN",
            type: "INR",
          })}
        </div>
      </div>
    </Link>
  ) : null;
};

export default Card;
