import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../modules/users/usersSlice";
import alertReducer from "../other/alertSlice";
import confirmReducer from "../other/ConfirmSlice";
import actionReducer from "../global/actions/actionSlice";
import settingsReducer from "../modules/settings/SettingsSlice";
import bidsReducer from "../modules/bids/BidsSlice";
import officesReducer from "../modules/offices/OfficesSlice";
import logsReducer from "../modules/logs/LogsSlice";
import facilitiesReducer from "../modules/facilities/FacilitiesSlice";
import currencyExchangeReducer from "../other/apis/CurrencyExchangeSlice";
import facilityRentReducer from "../modules/facilities/rent/FacilityRentSlice";
import facilityBookingsReducer from "../modules/facilities/bookings/bookingsSlice";
import tenantHistoryReducer from "../modules/history/HistorySlice";
import availableUnitsReducer from "../modules/home/unitsSlice";
import facilitiesForSaleReducer from "../modules/facilitiesForSale/facilitiesForSaleSlice";
import tenantBookingsReducer from "../modules/bookings/bookingsSlice";
import brokerFeesReducer from "../modules/brokerFee/BrokerFeesSlice";
import receiptsReducer from "../modules/receipts/receiptsSlice";
import accommodationRentReducer from "../modules/accommodations/AccommodationRentSlice";
import tenantAccommodationsReducer from "../modules/accommodations/tenantAccommodationsSlice";
import facilityAccommodationsReducer from "../modules/home/moreFacilityUnitsSlice";
import availableCondominiumsReducer from "../modules/condominiums/condominiumsSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    alert: alertReducer,
    confirm: confirmReducer,
    action: actionReducer,
    settings: settingsReducer,
    bids: bidsReducer,
    offices: officesReducer,
    logs: logsReducer,
    facilities: facilitiesReducer,
    currencyExchange: currencyExchangeReducer,
    accommodationRent: accommodationRentReducer,
    facilityRent: facilityRentReducer,
    facilityBookings: facilityBookingsReducer,
    tenantHistory: tenantHistoryReducer,
    availableUnits: availableUnitsReducer,
    facilitiesForSale: facilitiesForSaleReducer,
    tenantBookings: tenantBookingsReducer,
    brokerFees: brokerFeesReducer,
    receipts: receiptsReducer,
    tenantAccommodations: tenantAccommodationsReducer,
    facilityAccommodations: facilityAccommodationsReducer,
    availableCondominiums: availableCondominiumsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
