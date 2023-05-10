import React, { Suspense } from "react";
import moment from "moment";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

import {
  Accordian,
  AccordianBody,
  formatNumber,
  Loader,
  BASE_URL,
} from "@/modules/common";

import { useGetContactQuery } from "@/redux/services/contactApi";
import { useGetDealProductServiceQuery } from "@/redux/services/dealProductService";

const DealSideBar = ({ data }) => {
  return (
    <Suspense>
      {data ? (
        <aside className="w-[400px] shrink-0 h-full overflow-y-auto">
          <Accordian title={"Contacts"}>
            <AccordianBody>
              {data?.contacts?.length
                ? data.contacts.map((client, i) => {
                    return (
                      <ContactAccordian key={i} data={data} clientId={client} />
                    );
                  })
                : null}
            </AccordianBody>
          </Accordian>
          {data?.items?.length !== 0 && (
            <Accordian title={"Items"}>
              <AccordianBody>
                {data.items.map((itemId, index) => {
                  return <ItemCard key={index} itemId={itemId} />;
                })}
              </AccordianBody>
            </Accordian>
          )}
          <Accordian title={"Overview"}>
            <AccordianBody>
              <div>
                <div className="money/value font-medium flex items-center justify-between mb-3">
                  <p>Deal Age:</p>
                  <p>{moment(data.createdAt).fromNow()}</p>
                </div>
                {/* <div className="money/value flex items-center justify-between mb-3">
              <p>Inactive (Days):</p>
              <p>25 Days</p>
            </div> */}
                <div className="money/value flex items-center justify-between mb-3">
                  <p>Created:</p>
                  <p>{moment(data.createdAt).format("Do MMMM YYYY")}</p>
                </div>
                <div className="money/value flex items-center justify-between mb-3">
                  <p>Closing Date:</p>
                  <p>{moment(data.expectedClosingDate).format("DD-MM-YYYY")}</p>
                </div>
              </div>
            </AccordianBody>
          </Accordian>
        </aside>
      ) : (
        <Loader />
      )}
    </Suspense>
  );
};

const ContactAccordian = ({ clientId }) => {
  const {
    data: client,
    isLoading,
    isFetching,
    isSuccess,
  } = useGetContactQuery(clientId);

  return (
    !isLoading &&
    !isFetching &&
    isSuccess && (
      <Link to={"/contacts/" + client._id} className="block border p-2 mb-1">
        <div className="expected-close-date flex items-center gap-4 mb-2">
          <Icon icon="uil:user" className="text-2xl" />
          <Link to={"/contacts/" + client._id}>{client.contactPerson}</Link>
        </div>
        <div className="expected-close-date flex items-center gap-4">
          <Icon icon="uil:building" className="text-2xl" />
          <p>{client.company}</p>
        </div>
      </Link>
    )
  );
};

const ItemCard = ({ itemId }) => {
  const { data, isLoading, isFetching, isSuccess } =
    useGetDealProductServiceQuery({
      id: itemId,
      params: { populate: "productServiceId" },
    });
  return (
    !isLoading &&
    !isFetching &&
    isSuccess && (
      <div className="flex gap-3 items-start border-b py-3">
        {data?.productServiceId.image?.path && (
          <div className="w-[80px] h-[60px]">
            <img
              src={BASE_URL + data.productServiceId.image.path}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1">
          <h2 className="font-medium mb-1">{data.productServiceId.title}</h2>
          <div className="flex gap-1">
            <span className="border px-2 py-1">{formatNumber(data.rate)}</span>
            <span className="border px-2 py-1">
              {data.qty} {data.qty_type}
            </span>
            <span className="capitalize border px-2 py-1">
              {data.productServiceId.type}
            </span>
          </div>
        </div>
      </div>
    )
  );
};

export default DealSideBar;
