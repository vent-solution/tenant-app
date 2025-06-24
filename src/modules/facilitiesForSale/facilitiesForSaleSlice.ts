import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FacilitiesModel } from "../facilities/FacilityModel";
import axios from "axios";
import { fetchData } from "../../global/api";

interface StateModel {
  facilitiesForSale: FacilitiesModel[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: StateModel = {
  facilitiesForSale: [],
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
  status: "idle",
  error: null,
};

export const fetchFacilitiesForSale = createAsyncThunk(
  "fetchFacilitiesForSale",
  async ({ page, size }: { page: number; size: number }) => {
    try {
      const result = await fetchData(
        `/fetch-facilities-for-sale/${page}/${size}`
      );

      if (!result) {
        return initialState;
      }

      if (
        result.status !== 200 ||
        (result.data.status && result.data.status !== "OK")
      ) {
        return initialState;
      }

      return result.data;
    } catch (error) {
      if (axios.isCancel(error))
        console.log("ERROR FETCHING FACILITIES FOR SALE: ", error.message);
    }
  }
);

const facilitiesForSaleSlice = createSlice({
  name: "facilitiesForSale",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(fetchFacilitiesForSale.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });

    builder.addCase(
      fetchFacilitiesForSale.fulfilled,
      (state, action: PayloadAction<StateModel>) => {
        state.facilitiesForSale = action.payload.facilitiesForSale;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
        state.status = "succeeded";
        state.error = null;
      }
    );

    builder.addCase(fetchFacilitiesForSale.rejected, (state, action: any) => {
      state.status = "failed";
      state.error = action.error.message;
    });
  },
});

export const getFacilitiesForSale = (state: {
  facilitiesForSale: StateModel;
}) => state.facilitiesForSale;

export const getFacilitiesForSaleById =
  (facilityId: number) => (state: { facilitiesForSale: StateModel }) =>
    state.facilitiesForSale.facilitiesForSale.find(
      (facility) => Number(facility.facilityId) === Number(facilityId)
    );

export default facilitiesForSaleSlice.reducer;
