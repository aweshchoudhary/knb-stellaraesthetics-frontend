import React, { Suspense, useEffect, useState } from "react";
import moment from "moment";
import { Link } from "react-router-dom";

import Tooltip from "@mui/material/Tooltip";
import { Skeleton } from "@mui/material";

import { useGetDealQuery } from "@/redux/services/dealApi";
import { formatNumber } from "@/modules/common";
import { ActivityStatus } from "@/modules/activity";

const Deal = ({ dealId }) => {
  const {
    data: deal,
    isLoading,
    isFetching,
    isSuccess,
  } = useGetDealQuery({
    id: dealId,
    params: { populate: "label contacts items" },
  });

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
            <Tooltip title={deal.label.name} className="label mb-1">
              <p
                className="w-[20%] h-[5px]"
                style={{ background: deal.label.color }}
              ></p>
            </Tooltip>
            <h4 className="font-medium">{deal.title}</h4>
            <DealContacts contacts={deal.contacts} />
            <div className="activity absolute top-2 right-2">
              <ActivityStatus dealId={deal._id} />
            </div>
          </div>
          <div className="bottom text-xs flex items-center gap-3 text-sm">
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
              />
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
const DealTotal = ({ items, value }) => {
  const [total, setTotal] = useState(0);
  useEffect(() => {
    if (items.length !== 0) {
      items.forEach((item) => setTotal((prev) => +prev + +item.total));
    } else {
      setTotal(value);
    }
  }, []);
  return <p>{formatNumber(total)}</p>;
};

export default Deal;
