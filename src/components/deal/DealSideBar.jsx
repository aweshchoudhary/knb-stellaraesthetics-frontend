import { Icon } from "@iconify/react";
import FileInput from "../customFields/Fields/FileInput";
import Accordian, { AccordianBody } from "../global/Accordian";
import formatNumber from "../functions/formatNumber";
import moment from "moment";
import Loader from "../global/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getClientById } from "../../state/features/clientSlice";

const DealSideBar = ({ data }) => {
  const client = useSelector((state) => state.client);
  const dispatch = useDispatch();
  useEffect(() => {
    if (data.clientId) {
      dispatch(getClientById(data.clientId));
    }
  }, [data]);
  return client.data && data ? (
    <aside className="w-[350px] shrink-0 h-full overflow-y-auto">
      <Accordian title={"Summary"}>
        <AccordianBody>
          <div>
            <div className="money/value flex items-center gap-4 mb-4">
              <Icon icon="ph:money" className="text-2xl" />
              <p>
                {formatNumber(data?.value?.value, {
                  country: "en-IN",
                  type: "INR",
                })}
              </p>
            </div>
            <div className="expected-close-date flex items-center gap-4 mb-4">
              <Icon icon="bx:calendar" className="text-2xl" />
              <p>{moment(data.createdAt).format("DD-MM-YYYY")}</p>
            </div>
            <div className="expected-close-date flex items-center gap-4 mb-4">
              <Icon icon="uil:user" className="text-2xl" />
              <p>{client.data.contactPerson}</p>
            </div>
            <div className="expected-close-date flex items-center gap-4 mb-4">
              <Icon icon="uil:building" className="text-2xl" />
              <p>{client.data.company}</p>
            </div>
          </div>
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
      <Accordian title={"Custom Fields"}>
        <AccordianBody>
          <div>
            <FileInput />
          </div>
        </AccordianBody>
      </Accordian>
    </aside>
  ) : (
    <Loader />
  );
};

export default DealSideBar;
