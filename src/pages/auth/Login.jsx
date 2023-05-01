import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
// import { toast } from "react-toastify";

let initialValues = {
  user: "",
  password: "",
};

const validationSchema = Yup.object().shape({
  user: Yup.string().required("Full name is required"),
  password: Yup.string().required("Password is required"),
});

const Register = () => {
  // Validation
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => handleLogin(values),
  });

  function handleLogin(values) {
    console.log(values);
  }

  return (
    <section className="w-full h-screen py-10 overflow-y-auto flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-2 font-semibold">Stellar Aesthetics</h1>
      <p className="text-xl mb-5 font-medium">Create A New Account</p>
      <form onSubmit={formik.handleSubmit} className="w-1/3">
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
        <button type="submit" className="btn-filled w-full justify-center mt-5">
          Login
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

export default Register;
