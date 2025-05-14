import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { store } from "./app/store";
import { Provider } from "react-redux";
import "./styles/main.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { fetchCurrencyExchange } from "./other/apis/CurrencyExchangeSlice";
import { fetchAdminFinancialSettings } from "./modules/settings/SettingsSlice";
import { fetchOtherFacilities } from "./modules/market/otherFacilitiesSlice";
import { fetchAvailableUnits } from "./modules/home/unitsSlice";
import { fetchFacilitiesForSale } from "./modules/facilitiesForSale/facilitiesForSaleSlice";

store.dispatch(fetchCurrencyExchange());
store.dispatch(fetchAdminFinancialSettings());
store.dispatch(fetchOtherFacilities({ page: 0, size: 100 }));
store.dispatch(fetchAvailableUnits({ page: 0, size: 25 }));
store.dispatch(fetchFacilitiesForSale({ page: 0, size: 25 }));

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <Router basename={process.env.NODE_ENV === "production" ? "/tenant" : "/"}>
      <App />
    </Router>
  </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
