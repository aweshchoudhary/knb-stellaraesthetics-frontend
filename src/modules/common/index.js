import { lazy } from "react";

import BASE_URL from "./utils/BASE_URL";
import axiosInstance from "./utils/axiosInstance";
import formatNumber from "./utils/formatNumber";

export const Layout = lazy(() => import("./components/Layout"));
export const Accordian = lazy(() => import("./components/Accordian"));
export const AccordianBody = lazy(() => import("./components/AccordianBody"));
export const Header = lazy(() => import("./components/Header"));
export const Loader = lazy(() => import("./components/Loader"));
export const Model = lazy(() => import("./components/Model"));
export const RichTextEditor = lazy(() => import("./components/RichTextEditor"));
export const SideBar = lazy(() => import("./components/SideBar"));
export const CurrencySelect = lazy(() => import("./components/CurrencySelect"));

export { BASE_URL, axiosInstance, formatNumber };
