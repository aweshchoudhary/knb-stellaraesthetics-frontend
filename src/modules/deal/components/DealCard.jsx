import React, { Suspense, useEffect, useState } from "react";
import moment from "moment";
import { Link } from "react-router-dom";

import Tooltip from "@mui/material/Tooltip";
import { Skeleton } from "@mui/material";

import { useLazyGetLabelQuery } from "@/redux/services/labelApi";
import { useGetDealQuery } from "@/redux/services/dealApi";
import { formatNumber } from "@/modules/common";
import { ActivityStatus } from "@/modules/activity";
import { Icon } from "@iconify/react";

const Deal = ({ dealId, setColumnInfo }) => {
  const [label, setLabel] = useState({});
  const [total, setTotal] = useState(0);

  const {
    data: deal,
    isLoading,
    isFetching,
    isSuccess,
  } = useGetDealQuery({ id: dealId, params: { populate: "items contacts" } });

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

  useEffect(() => {
    if (!deal) return;
    if (deal?.label) {
      fetchLabel(deal.label);
    }
    if (setColumnInfo) {
      setColumnInfo((prev) => ({
        ...prev,
        totalDeals: prev.totalDeals + 1,
      }));
    }
  }, [deal]);

  useEffect(() => {
    if (setColumnInfo) {
      setColumnInfo((prev) => ({
        ...prev,
        totalRevenue: prev.totalRevenue + total,
      }));
    }
  }, [total]);

  return (
    <Suspense>
      {!isLoading && !isFetching && isSuccess ? (
        <Link
          to={"/deals/" + deal._id}
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
            <h4 className="font-medium">{deal.title}</h4>
            <DealContacts contacts={deal.contacts} />
            <div className="activity absolute top-2 right-2">
              <ActivityStatus dealId={deal._id} />
            </div>
          </div>
          <div className="bottom flex items-center gap-3 text-sm">
            <div className="user">
              <Tooltip title={moment(deal.createdAt).format("DD-MM-YYYY")}>
                <span>{moment(deal.createdAt).fromNow()}</span>
              </Tooltip>
            </div>
            <div className="amount flex items-center">
              <DealTotal
                items={deal.items}
                value={deal.value}
                currency={deal.currency}
                total={total}
                setTotal={setTotal}
              />
            </div>
            <Tooltip title={deal?.items?.length + " products"}>
              <div className="flex items-center gap-2">
                <Icon icon="mdi:box-outline" className="text-base" />
                {deal?.items?.length}
              </div>
            </Tooltip>
          </div>
        </Link>
      ) : (
        <Skeleton
          variant="rectangular"
          height={100}
          sx={{ width: "100%" }}
          className="mb-1"
        />
      )}
    </Suspense>
  );
};

const DealContacts = ({ contacts = [] }) => {
  return (
    <p className="text-gray-500 text-xs flex gap-2 mt-1">
      {contacts?.map((client, i) => {
        return (
          i < 2 && (
            <span>
              {client.contactPerson}
              {contacts.length - 1 !== i && ","}
            </span>
          )
        );
      })}
      {contacts.length > 2 && <span>{contacts.length - 2} more</span>}
    </p>
  );
};
const DealTotal = ({ items, value, total, setTotal }) => {
  useEffect(() => {
    if (items.length !== 0) {
      let currTotal = 0;
      items.forEach((item) => (currTotal = +item.total));
      setTotal(currTotal);
    } else {
      setTotal(value);
    }
  }, []);
  return <p>{formatNumber(total)}</p>;
};

export default Deal;
