import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Home from "../pages/Home";
import ChannelsList from "../pages/ChannelsList";
import Analytics from "../pages/Analytics";
import AnalyticsPartnerPage from "../pages/AnalyticsPartnerPage";
import AddressView, {
  LegacyAddressRedirect,
} from "../pages/AddressView";
import Actionable from "../pages/Actionable";
import ChannelDetail from "../pages/ChannelDetail";
import GuidePage from "../pages/GuidePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "channels", element: <ChannelsList /> },
      { path: "analytics/payer/:address", element: <AnalyticsPartnerPage /> },
      { path: "analytics/payee/:address", element: <AnalyticsPartnerPage /> },
      { path: "analytics", element: <Analytics /> },
      {
        path: "address/payer/:address",
        element: <LegacyAddressRedirect role="payer" />,
      },
      {
        path: "address/payee/:address",
        element: <LegacyAddressRedirect role="payee" />,
      },
      { path: "address/:address", element: <AddressView /> },
      { path: "actionable", element: <Actionable /> },
      {
        path: "finalized",
        element: <Navigate to="/channels?finalized=1" replace />,
      },
      { path: "guide", element: <GuidePage /> },
      { path: "faq", element: <Navigate to="/guide" replace /> },
      { path: "channel/:id", element: <ChannelDetail /> },
    ],
  },
]);
