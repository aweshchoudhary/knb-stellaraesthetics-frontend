import React, { useEffect } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../redux/services/authApi";
import { toast } from "react-toastify";
// import { toast } from "react-toastify";

let initialValues = {
  fullname: "",
  username: "",
  email: "",
  password: "",
  cpassword: "",
};

const validationSchema = Yup.object().shape({
  fullname: Yup.string()
    .min(6, "Full Name must be at least 6 characters")
    .required("Full name is required"),
  username: Yup.string()
    .min(6, "Username must be at least 6 characters")
    .required("Username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  cpassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const Register = () => {
  const [registerUser, { isLoading, isSuccess, isError, error }] =
    useRegisterMutation();
  const navigate = useNavigate();

  // Validation
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => handlRegisterUser(values),
  });

  async function handlRegisterUser(values) {
    await registerUser(values);
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success("Registered Successfully");
      navigate("/login");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) toast.error(error.data.message);
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
            name="fullname"
            placeholder="full name"
            id="fullname"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.fullname}
          />
          {formik.touched.fullname && formik.errors.fullname ? (
            <div className="mt-2 text-red-600 text-sm flex items-center gap-1">
              <Icon icon="ic:round-error" className="text-lg" />
              {formik.errors.fullname}
            </div>
          ) : null}
        </div>
        <div className="my-2">
          <input
            className="input py-3"
            type="text"
            name="username"
            placeholder="username"
            id="username"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
          />
          {formik.touched.username && formik.errors.username ? (
            <div className="mt-2 text-red-600 text-sm flex items-center gap-1">
              <Icon icon="ic:round-error" className="text-lg" />
              {formik.errors.username}
            </div>
          ) : null}
        </div>
        <div className="my-2">
          <input
            className="input py-3"
            type="email"
            name="email"
            id="email"
            placeholder="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="mt-2 text-red-600 text-sm flex items-center gap-1">
              <Icon icon="ic:round-error" className="text-lg" />
              {formik.errors.email}
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
        <div className="my-2">
          <input
            className="input py-3"
            type="password"
            name="cpassword"
            id="cpassword"
            placeholder="confirm password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.cpassword}
          />
          {formik.touched.cpassword && formik.errors.cpassword ? (
            <div className="mt-2 text-red-600 text-sm flex items-center gap-1">
              <Icon icon="ic:round-error" className="text-lg" />
              {formik.errors.cpassword}
            </div>
          ) : null}
        </div>
        <button type="submit" className="btn-filled w-full justify-center mt-5">
          {isLoading ? "Loading..." : "Create Account"}
        </button>
        <p className="mt-2">
          Already have an account?{" "}
          <Link className="text-primary font-medium" to="/login">
            Login
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Register;
