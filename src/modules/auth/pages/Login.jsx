import React, { useEffect } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLoginMutation } from "@/redux/services/authApi";
import { setCredentials } from "@/redux/features/authSlice";
import { useDispatch } from "react-redux";

let initialValues = {
  user: "",
  password: "",
};

const validationSchema = Yup.object().shape({
  user: Yup.string().required("Email or Username is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const [login, { data, isLoading, isSuccess, isError, error }] =
    useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Validation
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => handleLogin(values),
  });

  function handleLogin(values) {
    login(values);
  }

  useEffect(() => {
    if (data?.accessToken) {
      dispatch(setCredentials({ accessToken: data.accessToken }));
      navigate("/dashboard");
    }
  }, [data]);

  useEffect(() => {
    if (isSuccess) toast.success("Logged In Successfully");
  }, [isSuccess]);

  useEffect(() => {
    if (isError) toast.error(error?.data?.message);
  }, [isError]);

  return (
    <section className="w-full h-screen py-10 overflow-y-auto flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-2 font-semibold">Stellar Aesthetics</h1>
      <p className="text-xl mb-5 font-medium">Create A New Account</p>
      <form onSubmit={formik.handleSubmit} className="w-1/3">
        <div className="my-2">
          <input
            className="input py-3"
            type="text"
            name="user"
            id="user"
            placeholder="user"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.user}
          />
          {formik.touched.user && formik.errors.user ? (
            <div className="mt-2 text-red-600 text-sm flex items-center gap-1">
              <Icon icon="ic:round-error" className="text-lg" />
              {formik.errors.user}
            </div>
          ) : null}
        </div>
        <div className="my-2">
          <input
            className="input py-3"
            type="password"
            name="password"
            id="password"
            placeholder="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="mt-2 text-red-600 text-sm flex items-center gap-1">
              <Icon icon="ic:round-error" className="text-lg" />
              {formik.errors.password}
            </div>
          ) : null}
        </div>
        <button type="submit" className="btn-filled w-full justify-center mt-5">
          {isLoading ? "Loading..." : "Login"}
        </button>
        <p className="mt-2">
          Don&apos;t have an account?{" "}
          <Link className="text-primary font-medium" to={"/register"}>
            Create One
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Login;
