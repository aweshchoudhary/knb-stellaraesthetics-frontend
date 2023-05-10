import { lazy } from "react";

const Items = lazy(() => import("./pages/Items"));
const Item = lazy(() => import("./pages/Item"));

const DealDraftItem = lazy(() => import("./components/DealDraftItem"));
const DealItemSelect = lazy(() => import("./components/DealItemSelect"));
const DealItemTable = lazy(() => import("./components/DealItemTable"));
const ItemTable = lazy(() => import("./components/ItemTable"));

const CreateItemModel = lazy(() =>
  import("./components/models/CreateItemModel")
);

export {
  Items,
  Item,
  CreateItemModel,
  DealDraftItem,
  DealItemSelect,
  DealItemTable,
  ItemTable,
};
