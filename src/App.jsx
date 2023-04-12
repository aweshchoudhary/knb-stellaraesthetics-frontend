import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import { lazy } from "react";

// import { AuthProvider } from "oidc-react";
// import { setUser } from "./state/features/authSlice";
import "react-toastify/dist/ReactToastify.css";

import Layout from "./components/Layout/Layout";
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Deals = lazy(() => import("./pages/deals/Deals"));
const Deal = lazy(() => import("./pages/deals/Deal"));
const Activities = lazy(() => import("./pages/Activities"));
const Products = lazy(() => import("./pages/Products"));
const Services = lazy(() => import("./pages/Services"));
const NotFound = lazy(() => import("./pages/User"));
const User = lazy(() => import("./pages/User"));

const App = () => {
  const dispatch = useDispatch();

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
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/deals/:id" element={<Deal />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/products" element={<Products />} />
            <Route path="/services" element={<Services />} />
            <Route path="/user" element={<User />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
    // </AuthProvider>
  );
};

export default App;
