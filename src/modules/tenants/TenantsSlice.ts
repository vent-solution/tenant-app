import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchData } from "../../global/api";
import { HistoryModel } from "../history/HistoryModel";

interface StateModel {
  landlordTenants: HistoryModel[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  status: "idle" | "succeeded" | "loading" | "failed";
  error: string | null;
}

const initialState: StateModel = {
  landlordTenants: [],
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
  status: "idle",
  error: null,
};

export const fetchLandlordTenants = createAsyncThunk(
  "fetchLandlordTenants",
  async ({
    facilityIDs,
    page,
    size,
  }: {
    facilityIDs: number[];
    page: number;
    size: number;
  }) => {
    try {
      if (facilityIDs.length < 1) {
        return initialState;
      }

      const result = await fetchData(
        `/fetch-landlord-tenants/${facilityIDs}/${page}/${size}`
      );

      if (
        (result.data.status && result.data.status !== "OK") ||
        result.status !== 200
      ) {
        return initialState;
      }
      return result.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH TENANTS CANCELLED: ", error.message);
        return initialState;
      }
    }
  }
);

const landlordTenantsSlice = createSlice({
  name: "landlordTenants",
  initialState,
  reducers: {
    resetLandlordTenants: {
      reducer: (state, action: PayloadAction<StateModel>) => {
        state.landlordTenants = action.payload.landlordTenants;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      },
      prepare: (tenantsState: StateModel) => {
        return { payload: tenantsState };
      },
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchLandlordTenants.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchLandlordTenants.fulfilled,
        (state, action: PayloadAction<StateModel>) => {
          state.landlordTenants = action.payload.landlordTenants;
          state.page = action.payload.page;
          state.size = action.payload.size;
          state.totalElements = action.payload.totalElements;
          state.totalPages = action.payload.totalPages;
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(fetchLandlordTenants.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const getLandlordTenants = (state: { landlordTenants: StateModel }) =>
  state.landlordTenants;

export const { resetLandlordTenants } = landlordTenantsSlice.actions;

export default landlordTenantsSlice.reducer;
