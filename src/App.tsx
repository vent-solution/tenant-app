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

function App() {
  console.log("TENANT APP");

  const [, setLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    webSocketService.connect();

    usersTopicSubscription(setLoading, dispatch);
    accommodationsTopicSubscription(dispatch);

    return () => {
      console.log("Unsubscribing from WebSocket...");
      webSocketService.unsubscribe("/topic/users");
      webSocketService.disconnect();
    };
  }, [dispatch]);

  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />

        <Route path="/tenant/:userId" element={<LandingPage />} />

        <Route path={`home`}>
          <Route index element={<HomePage />} />
        </Route>

        <Route path="facilitiesForSale">
          <Route index element={<FacilitiesForSalePage />} />
        </Route>

        <Route path="accommodations">
          <Route index element={<AccommodationsPage />} />
        </Route>

        <Route path="bookings">
          <Route index element={<BookingsPage />} />
        </Route>

        <Route path="brokerFees">
          <Route index element={<BrokerFeePage />} />
        </Route>

        <Route path="history">
          <Route index element={<HistoryPage />} />
        </Route>

        <Route path="receipts">
          <Route index element={<ReceiptsPage />} />
        </Route>

        <Route path="logs">
          <Route index element={<LogsPage />} />
        </Route>

        <Route path="users">
          <Route index element={<UsersPage />} />
          <Route path=":userId" element={<SingleUserPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
