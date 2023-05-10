import { lazy } from "react";

const Dashboard = lazy(() => import("./pages/Dashboard"));

const AreaDashboard = lazy(() => import("./components/AreaDashboard"));
const BarDashboard = lazy(() => import("./components/BarDashboard"));
const CountDashboard = lazy(() => import("./components/CountDashboard"));
const LineDashboard = lazy(() => import("./components/LineDashboard"));
const RadarDashboard = lazy(() => import("./components/RadarDashboard"));
const ScatterDashboard = lazy(() => import("./components/ScatterDashboard"));

export {
  Dashboard,
  AreaDashboard,
  BarDashboard,
  CountDashboard,
  LineDashboard,
  RadarDashboard,
  ScatterDashboard,
};
