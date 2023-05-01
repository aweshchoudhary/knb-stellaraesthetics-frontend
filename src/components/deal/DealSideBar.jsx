import React from "react";
import { Icon } from "@iconify/react";
import Accordian, { AccordianBody } from "../global/Accordian";
import formatNumber from "../functions/formatNumber";
import moment from "moment";
import Loader from "../global/Loader";
import { useGetContactQuery } from "../../services/contactApi";
import { Link } from "react-router-dom";

const DealSideBar = ({ data }) => {
  return data ? (
    <aside className="w-[400px] shrink-0 h-full overflow-y-auto">
      <Accordian title={"Contacts"}>
        <AccordianBody>
          <div className="money/value flex items-center gap-4 mb-4">
            <Icon icon="ph:money" className="text-2xl" />
            <p>
              {formatNumber(data?.value?.value, {
                country: "en-IN",
                type: "INR",
              })}
            </p>
          </div>
          {data?.contacts?.length
            ? data.contacts.map((client, i) => {
                return (
                  <ContactAccordian key={i} data={data} clientId={client} />
                );
              })
            : null}
        </AccordianBody>
      </Accordian>
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

export default DealSideBar;
