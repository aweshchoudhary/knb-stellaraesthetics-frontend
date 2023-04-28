import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { lazy } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-tabs/style/react-tabs.css";

import Layout from "./components/Layout/Layout";
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Pipelines = lazy(() => import("./pages/Pipelines"));
const Deal = lazy(() => import("./pages/Deal"));
const Contacts = lazy(() => import("./pages/Contacts"));
const Contact = lazy(() => import("./pages/Contact"));
const ActivityCalendar = lazy(() => import("./pages/ActivityCalendar"));
const Products = lazy(() => import("./pages/Products"));
const Services = lazy(() => import("./pages/Services"));
const NotFound = lazy(() => import("./pages/User"));
const User = lazy(() => import("./pages/User"));

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
            <Route path="/pipeline" element={<Pipelines />} />
            <Route path="/deals/:id" element={<Deal />} />
            <Route path="/activities" element={<ActivityCalendar />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/contacts/:id" element={<Contact />} />
            <Route path="/products" element={<Products />} />
            <Route path="/services" element={<Services />} />
            <Route path="/user" element={<User />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
    // </AuthProvider>
  );
};

export default App;
