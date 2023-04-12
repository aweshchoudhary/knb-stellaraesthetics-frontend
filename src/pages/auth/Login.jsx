import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user]);
  return (
    <section className="flex h-screen items-center justify-center">
      <div>
        <h1 className="md:text-5xl text-3xl mb-3 font-semibold">
          Redirecting To Zitadel Auth
        </h1>
        <p className="text-lg">Please Wait...</p>
      </div>
    </section>
  );
};

export default Login;
