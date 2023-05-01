import React, { Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { lazy } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";

import Layout from "./components/Layout/Layout";
import Loader from "./components/global/Loader";
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Pipelines = lazy(() => import("./pages/pipeline/Pipelines"));
const Pipeline = lazy(() => import("./pages/pipeline/Pipeline"));
const Deal = lazy(() => import("./pages/Deal"));
const Contacts = lazy(() => import("./pages/contact/Contacts"));
const Contact = lazy(() => import("./pages/contact/Contact"));
const ActivityCalendar = lazy(() => import("./pages/ActivityCalendar"));
const Products = lazy(() => import("./pages/Products"));
const Services = lazy(() => import("./pages/Services"));
const NotFound = lazy(() => import("./pages/User"));
const User = lazy(() => import("./pages/User"));
const Register = lazy(() => import("./pages/auth/Register"));
const Login = lazy(() => import("./pages/auth/Login"));

const App = () => {
  const darkMode = useSelector((state) => state.global.darkMode);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#571168",
      },
    },
    typography: {
      fontFamily: ["Poppins", "Roboto"].join(","),
    },
  });

  // const zitadelConfig = {
  //   onSignIn: async (response) => {
  //     dispatch(setUser(response));
  //     window.location.hash = "";
  //   },
  //   authority: "https://au.stellaraesthetics.in/",
  //   clientId: "206769574157323753@authentication_with_react",
  //   responseType: "code",
  //   redirectUri: "http://localhost:5173/dashboard",
  //   scope: "openid profile email",
  // };
  return (
    // <AuthProvider {...zitadelConfig}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pipelines" element={<Pipelines />} />
            <Route path="/pipeline/:id" element={<Pipeline />} />
            <Route path="/deals/:id" element={<Deal />} />
            <Route path="/activities" element={<ActivityCalendar />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/contacts/:id" element={<Contact />} />
            <Route path="/products" element={<Products />} />
            <Route path="/services" element={<Services />} />
            <Route path="/user" element={<User />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route
            path="/register"
            element={
              <Suspense
                fallback={
                  <section className="w-screen h-screen flex items-center justify-center">
                    <Loader />
                  </section>
                }
              >
                <Register />
              </Suspense>
            }
          />
          <Route
            path="/login"
            element={
              <Suspense
                fallback={
                  <section className="w-screen h-screen flex items-center justify-center">
                    <Loader />
                  </section>
                }
              >
                <Login />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
    // </AuthProvider>
  );
};

export default App;
