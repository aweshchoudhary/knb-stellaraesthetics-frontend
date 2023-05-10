import { lazy } from "react";

const User = lazy(() => import("./pages/User"));
const UserSelect = lazy(() => import("./components/UserSelect"));

export { User, UserSelect };
