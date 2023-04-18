import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import axiosInstance from "../../config/axiosInstance";
import { useEffect, useState } from "react";
import formatNumber from "../functions/formatNumber";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getClientById } from "../../state/features/clientSlice";
import Tooltip from "@mui/material/Tooltip";
import { Skeleton } from "@mui/material";
import { useGetCardQuery } from "../../services/dealApi";
import { labelApi } from "../../services/labelApi";

const Card = ({ id }) => {
  const { isError, isLoading, isSuccess, isFetching, data, error } =
    useGetCardQuery(id);

  const client = useSelector((state) => state.client);
  const dispatch = useDispatch();
  const [label, setLabel] = useState({});

  const fetchLabel = async (id) => {
    try {
      const labelRes = await dispatch(labelApi.endpoints.getLabel.initiate(id));
      setLabel(labelRes.data.data);
    } catch (err) {
      toast.error(err.response);
    }
  };

  useEffect(() => {
    if (data?.label) {
      fetchLabel(data.label);
    }
    if (data?.clientId) dispatch(getClientById(data?.clientId));
  }, [data]);

  useEffect(() => {
    if (isError) toast.error(error);
  }, [isError]);

  return !isLoading && isSuccess ? (
    <Link
      to={"/deals/" + data._id}
      className={
        "cursor-pointer w-full bg-bg text-sm relative border mb-1 p-2 flex flex-col gap-2"
      }
    >
      <div className="top">
        {data.label && (
          <Tooltip title={label.name} className="label mb-1">
            <p
              className="w-[20%] h-[5px]"
              style={{ background: label.color }}
            ></p>
          </Tooltip>
        )}
        <h4 className="font-medium">{data.title}</h4>
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
          {formatNumber(data?.value?.value, {
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
