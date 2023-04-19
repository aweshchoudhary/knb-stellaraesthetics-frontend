import { useParams } from "react-router-dom";
import { useGetClientQuery } from "../services/clientApi";
import Header from "../components/global/Header";
import Loader from "../components/global/Loader";
import { Icon } from "@iconify/react";

const Contact = () => {
  const params = useParams();
  const { id } = params;
  const { data, isLoading, isError, isSuccess, isFetching, error } =
    useGetClientQuery(id);
  return (
    <>
      <Header title={"Contact"} />

      {!isLoading && !isFetching && isSuccess ? (
        <>
          <section className="p-5 border-b">
            <h1 className="text-xl font-semibold flex items-center gap-4">
              <Icon icon={"uil:user"} className="text-3xl" />{" "}
              <span>{data.contactPerson}</span>
            </h1>
          </section>
          <section className="flex w-full border-b">
            <div className="flex-1 border-r">
              <header className="py-3 px-5 bg-primary text-white border-b">
                <h2>Personal Details</h2>
              </header>
              <div className="p-5 flex flex-col gap-3">
                <p>Full Name: {data.contactPerson}</p>
                <p>Mobile Number: {data.mobile}</p>
                <p>Whatsapp Number:{data.whatsapp}</p>
                <p>Email: {data.email}</p>
                <p>Address: Not Specified</p>
              </div>
            </div>
            <div className="flex-1 border-r">
              <header className="py-3 px-5 bg-primary text-white border-b">
                <h2>Open Deals</h2>
              </header>
              <div className="p-5 flex flex-col gap-2">
                <div className="w-full py-3 px-4 border flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <span className="w-[30px] h-[30px] rounded-full bg-gray-500"></span>
                    <h2>Deal 1</h2>
                  </div>
                  <div>10,000Rs</div>
                </div>
                <div className="w-full py-3 px-4 border flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <span className="w-[30px] h-[30px] rounded-full bg-gray-500"></span>
                    <h2>Deal 1</h2>
                  </div>
                  <div>10,000Rs</div>
                </div>
                <div className="w-full py-3 px-4 border flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <span className="w-[30px] h-[30px] rounded-full bg-gray-500"></span>
                    <h2>Deal 1</h2>
                  </div>
                  <div>10,000Rs</div>
                </div>
              </div>
            </div>
            <div className="flex-1 border-r">
              <header className="py-3 px-5 bg-primary text-white border-b">
                <h2>Next Activities</h2>
              </header>
              <div className="p-5 flex flex-col gap-3">
                <div className="w-full py-3 px-4 border flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <Icon icon="uil:phone" className="text-xl" />
                    <h2>Call For Details</h2>
                  </div>
                  <div>20 April 2023</div>
                </div>
                <div className="w-full py-3 px-4 border flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <Icon icon="uil:envelope" className="text-xl" />
                    <h2>Email For Reminder</h2>
                  </div>
                  <div>24 April 2023</div>
                </div>
                <div className="w-full py-3 px-4 border flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <Icon icon="uil:envelope" className="text-xl" />
                    <h2>Email For Reminder</h2>
                  </div>
                  <div>24 April 2023</div>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="w-full h-screen flex items-center justify-center">
          <Loader />
        </section>
      )}
    </>
  );
};

export default Contact;
