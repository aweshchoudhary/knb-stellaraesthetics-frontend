import { useDeleteNoteMutation } from "@/redux/services/noteApi";
import { Icon } from "@iconify/react";
import moment from "moment";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const NoteDisplayModel = ({ data, setIsOpen }) => {
  const [deleteNote, { isLoading, isError, isSuccess, error }] =
    useDeleteNoteMutation();

  async function handledDeleteActivity() {
    await deleteNote(data._id);
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success("Note deleted successfully");
      setIsOpen(false);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) toast.error(error.data?.message);
  }, [isError]);
  console.log(data);

  return (
    data && (
      <>
        <section className="p-10 pb-0">
          <div
            className="mb-5 input"
            dangerouslySetInnerHTML={{ __html: data.noteBody }}
          ></div>
          <div className="text-sm flex items-center mb-5 gap-3">
            <Link
              to={"/users/" + data?.creator?._id}
              className="hover:text-blue-600 hover:underline"
            >
              <p className="flex gap-2 items-center capitalize">
                <Icon icon="uil:user" className="text-xl" />
                {data?.creator?.fullname}
              </p>
            </Link>
            <p>
              <span>Created: {moment(data.createdAt).fromNow()}</span>
            </p>
          </div>
          <div className="mb-3">
            <h2 className="text-lg mb-2">Deals</h2>
            <p className="flex items-center gap-3">
              <span className="input">
                {data?.deals?.map((deal) => {
                  return deal.title;
                })}
              </span>
            </p>
          </div>
          <div>
            <h2 className="text-lg mb-2">Contacts</h2>
            <p className="flex items-center gap-3">
              <span className="input">
                {data?.contacts?.map((contact) => {
                  return contact.contactPerson;
                })}
              </span>
            </p>
          </div>
        </section>
        <footer className="modal-footer mt-5">
          <button
            disabled={isLoading}
            onClick={handledDeleteActivity}
            className="btn-filled bg-red-600 border-red-600 btn-small"
          >
            <Icon icon="uil:trash" />
            <span>{isLoading ? "Deleting..." : "Delete"}</span>
          </button>
          <button disabled={isLoading} className="btn-filled btn-small">
            <Icon icon="uil:pen" />
            <span>Edit</span>
          </button>
        </footer>
      </>
    )
  );
};

export default NoteDisplayModel;
