import React from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { useGetUserQuery } from "@/redux/services/userApi";
import { logOut } from "@/redux/features/authSlice";

import { Header, Loader } from "@/modules/common";

const User = () => {
  const loggedUserId = useSelector((state) => state.auth.loggedUserId);
  const { id } = useParams();
  console.log(id);
  const { data: user, isLoading, isFetching, isSuccess } = useGetUserQuery(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  function handleLogout() {
    dispatch(logOut());
    navigate("/login", { replace: true });
  }
  return !isLoading && !isFetching && isSuccess ? (
    <>
      <Header title={"User Page"} />
      <section className="flex items-center justify-between md:p-10 p-5 border-b">
        <div className="flex gap-5">
          <div className="shrink-0">
            {/* <img
              src={user.picture}
              className="w-[100px] h-[100px] rounded-full object-cover"
              width={200}
              height={200}
            /> */}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-semibold capitalize mb-2">
              {user.fullname || user.nickname}
            </h1>
            <p>Email: {user.email}</p>
            <p>Username: {user.username}</p>
            {user.phone && <p>Phone: {user.phone}</p>}
          </div>
        </div>
        {loggedUserId === user._id && (
          <button onClick={handleLogout} className="btn-filled">
            Logout
          </button>
        )}
      </section>
      <section className="md:p-10 p-5">
        <h2 className="text-3xl">Your Role</h2>
      </section>
    </>
  ) : (
    <section className="h-screen w-full flex items-center justify-center">
      <Loader />
    </section>
  );
};

export default User;
