import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Home from "../pages/Home";
import AddressView from "../pages/AddressView";
import Actionable from "../pages/Actionable";
import Finalized from "../pages/Finalized";
import ChannelDetail from "../pages/ChannelDetail";
import GuidePage from "../pages/GuidePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "address/:type/:address", element: <AddressView /> },
      { path: "actionable", element: <Actionable /> },
      { path: "finalized", element: <Finalized /> },
      { path: "guide", element: <GuidePage /> },
      { path: "channel/:id", element: <ChannelDetail /> },
    ],
  },
]);
