import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../components/global/Header";
import { logout } from "../state/features/authSlice";

const User = () => {
  const profile = useSelector((state) => state?.auth?.user?.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  function handleLogout() {
    dispatch(logout());
    navigate("/login", { replace: true });
  }
  return profile ? (
    <>
      <Header title={profile.name} />
      <section className="flex items-center justify-between md:p-10 p-5 border-b">
        <div className="flex gap-5">
          <div className="shrink-0">
            <img
              src={profile.picture}
              className="w-[100px] h-[100px] rounded-full object-cover"
              width={200}
              height={200}
            />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl">{profile.name || profile.nickname}</h1>
            <p>Email: {profile.email}</p>
            <p>Username: {profile.preferred_username}</p>
            {profile.phone && <p>Phone: {profile.phone}</p>}
          </div>
        </div>
        <button onClick={handleLogout} className="btn-filled">
          Logout
        </button>
      </section>
      <section className="md:p-10 p-5">
        <h2 className="text-3xl">Your Role</h2>
      </section>
    </>
  ) : (
    <p>Loading...</p>
  );
};

export default User;
