import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import formatNumber from "../functions/formatNumber";
import Tooltip from "@mui/material/Tooltip";
import { Skeleton } from "@mui/material";
// import { useLazyGetContactQuery } from "../../redux/services/contactApi";
import { useLazyGetLabelQuery } from "../../redux/services/labelApi";
import ActivityStatus from "../deal/ActivityStatus";
import moment from "moment";

const Deal = ({ deal }) => {
  const [label, setLabel] = useState({});
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
    // if (deal?.contacts?.length) {
    //   deal.contacts.forEach((contact) => {
    //     fetchContact(contact);
    //   });
    // }
  }, [deal]);

  return deal ? (
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
        {/* <DealContacts contacts={deal.contacts} /> */}
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
          {formatNumber(deal?.value?.value, {
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

// const DealContacts = ({ contacts = [] }) => {
//   const [clients, setContacts] = useState([]);
//   const [
//     getContactById,
//     {
//       isLoading: isContactsLoading,
//       isSuccess: isContactsSuccess,
//       isFetching: isContactsFetching,
//     },
//   ] = useLazyGetContactQuery();

//   const fetchContact = async (id) => {
//     const { data } = await getContactById(id);
//     setContacts((prev) => [...prev, data]);
//   };

//   useEffect(() => {
//     if (contacts.length) {
//       contacts.forEach((contact) => {
//         fetchContact(contact);
//       });
//     }
//   }, [contacts]);

//   return !isContactsLoading && !isContactsFetching && isContactsSuccess ? (
//     <p className="text-gray-500 text-xs flex gap-2 mt-1">
//       {clients?.map((client, i) => {
//         return (
//           i < 2 && (
//             <span>
//               {client.contactPerson}
//               {clients.length - 1 !== i && ","}
//             </span>
//           )
//         );
//       })}
//       {clients.length > 2 && <span>{clients.length - 2} more</span>}
//     </p>
//   ) : (
//     <p className="text-gray-500 text-xs flex gap-2 mt-1">Loading...</p>
//   );
// };

export default Deal;
