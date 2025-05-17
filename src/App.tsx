import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { useEffect, useState } from "react";
import HomePage from "./modules/home/HomePage";
import LogsPage from "./modules/logs/LogsPage";
import HistoryPage from "./modules/history/HistoryPage";
import UsersPage from "./modules/users/SingleUserPage";
import SingleUserPage from "./modules/users/SingleUserPage";
import FacilitiesForSalePage from "./modules/facilitiesForSale/FacilitiesForSalePage";
import BookingsPage from "./modules/bookings/BookingsPage";
import BrokerFeePage from "./modules/brokerFee/BrokerFeePage";
import ReceiptsPage from "./modules/receipts/ReceiptsPage";
import { webSocketService } from "./webSockets/socketService";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./app/store";
import { usersTopicSubscription } from "./webSockets/subscriptionTopics/usersTopicSubscription";
import { accommodationsTopicSubscription } from "./webSockets/subscriptionTopics/accommodationsTopicSubscription";
import { getUserLocation } from "./global/api";
import LandingPage from "./modules/LandingPage";
import AccommodationsPage from "./modules/accommodations/AccommodationsPage";
import { Navigate } from "react-router-dom";

function App() {
  const [, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    webSocketService.connect();
    usersTopicSubscription(setLoading, dispatch);
    accommodationsTopicSubscription(dispatch);

    return () => {
      webSocketService.unsubscribe("/topic/users");
      webSocketService.disconnect();
    };
  }, [dispatch]);

  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <Routes>
      {/* Optional redirect to a default tenant */}
      {/* <Route path="/" element={<Navigate to="/1/home" />} /> */}

      {/* All tenant routes go under this path */}
      <Route path="/" element={<Layout />}>
        <Route path=":userId">
          <Route index element={<LandingPage />} />
        </Route>
        <Route path="/home" element={<HomePage />} />
        <Route path="/facilitiesForSale" element={<FacilitiesForSalePage />} />
        <Route path="/accommodations" element={<AccommodationsPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/brokerFees" element={<BrokerFeePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/receipts" element={<ReceiptsPage />} />
        <Route path="/logs" element={<LogsPage />} />

        <Route path="users">
          <Route index element={<UsersPage />} />
          <Route path=":userId" element={<SingleUserPage />} />
        </Route>
      </Route>

      {/* Optional fallback for unmatched routes */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
}

export default App;
