import React, { Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import { Layout, Loader } from "@/modules/common";

import { Dashboard } from "@/modules/dashboard";
import { Pipelines, Pipeline } from "@/modules/pipeline";
import { Deal } from "@/modules/deal";
import { Activity } from "@/modules/activity";
import { Contact, Contacts } from "@/modules/contact";
import { Items, Item } from "@/modules/item";
import { User } from "@/modules/user";
import { Login, Register } from "@/modules/auth";

const App = () => {
  const darkMode = useSelector((state) => state.global.darkMode);
  const accessToken = useSelector((state) => state.auth.accessToken);

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
  return (
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
              element={accessToken ? <Activity /> : <Navigate to="/login" />}
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
              path="/users/:id"
              element={accessToken ? <User /> : <Navigate to="/login" />}
            />
            <Route
              path="/products-services"
              element={accessToken ? <Items /> : <Navigate to="/login" />}
            />
            <Route
              path="/products-services/:id"
              element={accessToken ? <Item /> : <Navigate to="/login" />}
            />
            {/* <Route path="/services" element={<Services />} /> */}
            {/* <Route path="*" element={<NotFound />} /> */}
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
