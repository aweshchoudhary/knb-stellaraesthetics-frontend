import { lazy } from "react";

import BASE_URL from "./utils/BASE_URL";
import axiosInstance from "./utils/axiosInstance";
import formatNumber from "./utils/formatNumber";

const Layout = lazy(() => import("./components/Layout"));
const Accordian = lazy(() => import("./components/Accordian"));
const AccordianBody = lazy(() => import("./components/AccordianBody"));
const Header = lazy(() => import("./components/Header"));
const Loader = lazy(() => import("./components/Loader"));
const Model = lazy(() => import("./components/Model"));
const RichTextEditor = lazy(() => import("./components/RichTextEditor"));
const SideBar = lazy(() => import("./components/SideBar"));
const CurrencySelect = lazy(() => import("./components/CurrencySelect"));

export {
  BASE_URL,
  axiosInstance,
  formatNumber,
  Layout,
  Accordian,
  AccordianBody,
  Header,
  Loader,
  Model,
  RichTextEditor,
  SideBar,
  CurrencySelect,
};
