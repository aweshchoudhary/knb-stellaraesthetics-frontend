import React, { Suspense, useEffect, useState } from "react";
import moment from "moment";

import { useNavigate, useParams } from "react-router-dom";
import {
  useDeleteProductServiceMutation,
  useGetProductServiceQuery,
} from "@/redux/services/productServiceApi";
import { useLazyGetUserQuery } from "@/redux/services/userApi";

import { toast } from "react-toastify";
import { Header, Loader, BASE_URL, lazyLoad } from "@/modules/common";
import { Icon } from "@iconify/react";

const CreateItemModel = lazyLoad("@/modules/item", "CreateItemModel");
const Model = lazyLoad("@/modules/common", "Model");

const Item = () => {
  const params = useParams();
  const { id } = params;

  const [isUpdateProductServiceModelOpen, setIsUpdateProductServiceModelOpen] =
    useState(false);

  const { data, isLoading, isFetching, isSuccess, isError, error } =
    useGetProductServiceQuery(id);
  const [
    getUserById,
    {
      data: creator,
      isLoading: isUserLoading,
      isFetching: isUserFetching,
      isError: isUserError,
      error: userError,
    },
  ] = useLazyGetUserQuery();

  useEffect(() => {
    if (data && data.creator) getUserById(data.creator);
  }, [data]);

  useEffect(() => {
    if (isError) {
      toast.error(error.data?.message);
    }
  }, [isError]);

  useEffect(() => {
    if (isUserError) {
      toast.error(userError.data?.message);
    }
  }, [isUserError]);

  return !isLoading && !isFetching && isSuccess && data ? (
    <>
      <Header title="Item Page" />
      <ItemHeader data={data} setIsOpen={setIsUpdateProductServiceModelOpen} />
      <section className="p-5 flex gap-5">
        <div className="w-1/3 shrink-0 p-1">
          <div className="h-[300px] overflow-hidden rounded transition flex items-center justify-center relative w-full border">
            {data?.image?.path ? (
              <img
                className="w-full object-contain"
                src={BASE_URL + data.image.path}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-paper">
                <Icon
                  className="text-8xl"
                  icon="material-symbols:image-not-supported"
                />
                <p>No Image</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1">
          <div>
            <h1 className="text-xl font-semibold mb-3">{data.title}</h1>
            <p className="input text-base min-h-[120px]">{data.description}</p>
          </div>
          <div className="flex gap-3 mt-3 capitalize">
            <span className="input text-lg font-medium">Rate: {data.rate}</span>
            <span className="input text-lg font-medium">Type: {data.type}</span>
          </div>

          <p className="flex gap-5 mt-3">
            <span>
              Creator:{" "}
              {isUserLoading && isUserFetching
                ? "Loading..."
                : creator?.fullname}
            </span>
            <span>
              Created At: {moment(data.createdAt).format("DD-MM-YYYY")}
            </span>
          </p>
        </div>
      </section>
      <Suspense>
        {isUpdateProductServiceModelOpen && (
          <Model>
            <CreateItemModel isUpdate={true} id={id} />
          </Model>
        )}
      </Suspense>
    </>
  ) : (
    <section className="flex items-center justify-center h-screen w-full">
      <Loader />
    </section>
  );
};

const ItemHeader = ({ data, setIsOpen }) => {
  const [
    deleteProductServiceMutation,
    {
      isLoading: isDeleting,
      isSuccess: isDeleteSuccess,
      isError: isDeleteError,
      error: deleteError,
    },
  ] = useDeleteProductServiceMutation();
  const navigate = useNavigate();

  async function handleDeleteProductService() {
    await deleteProductServiceMutation(data._id);
    navigate("/products-services");
  }

  useEffect(() => {
    if (isDeleteSuccess) {
      toast.success("Item Delete Successfully");
      navigate("/products-services");
    }
  }, [isDeleteSuccess]);

  useEffect(() => {
    if (isDeleteError) toast.error(deleteError.error?.message);
  }, [isDeleteError]);

  return (
    <header className="flex justify-between items-center px-5 py-3 border-b">
      <h1 className="text-xl font-semibold">{data.title}</h1>
      <div className="flex gap-2">
        <button
          onClick={handleDeleteProductService}
          className="btn-filled bg-red-600 border-red-600 btn-small"
        >
          {isDeleting ? "Deleting..." : "delete"}
        </button>
        <button
          className="btn-filled btn-small"
          onClick={() => setIsOpen(true)}
        >
          update
        </button>
      </div>
    </header>
  );
};

export default Item;
