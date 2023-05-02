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
// const Services = lazy(() => import("./pages/Services"));
const NotFound = lazy(() => import("./pages/User"));
const User = lazy(() => import("./pages/User"));
const Register = lazy(() => import("./pages/auth/Register"));
const Login = lazy(() => import("./pages/auth/Login"));

const App = () => {
  const darkMode = useSelector((state) => state.global.darkMode);
  const accessToken = useSelector((state) => state.global.accessToken);

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
            <Route
              path="/dashboard"
              element={accessToken ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/pipelines"
              element={accessToken ? <Pipelines /> : <Navigate to="/login" />}
            />
            <Route
              path="/pipeline/:id"
              element={accessToken ? <Pipeline /> : <Navigate to="/login" />}
            />
            <Route
              path="/deals/:id"
              element={accessToken ? <Deal /> : <Navigate to="/login" />}
            />
            <Route
              path="/activities"
              element={
                accessToken ? <ActivityCalendar /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/contacts"
              element={accessToken ? <Contacts /> : <Navigate to="/login" />}
            />
            <Route
              path="/contacts/:id"
              element={accessToken ? <Contact /> : <Navigate to="/login" />}
            />
            <Route
              path="/user"
              element={accessToken ? <User /> : <Navigate to="/login" />}
            />
            <Route
              path="/products"
              element={accessToken ? <Products /> : <Navigate to="/login" />}
            />
            {/* <Route path="/services" element={<Services />} /> */}
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
                {accessToken ? <Navigate to="/dashboard" /> : <Register />}
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
                {accessToken ? <Navigate to="/dashboard" /> : <Login />}
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
