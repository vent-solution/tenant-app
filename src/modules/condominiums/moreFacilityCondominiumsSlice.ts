import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchData } from "../../global/api";
import { AccommodationModel } from "../accommodations/AccommodationModel";

interface UpdateModel {
  id: number;
  changes: AccommodationModel;
}

interface StateModel {
  facilityCondominiums: AccommodationModel[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: StateModel = {
  facilityCondominiums: [],
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
  status: "idle",
  error: null,
};

export const fetchCondominiumsByFacility = createAsyncThunk(
  "fetchCondominiumsByFacility",
  async ({
    facilityId,
    page,
    size,
  }: {
    facilityId: number;
    page: number;
    size: number;
  }) => {
    try {
      const result = await fetchData(
        `/fetch-available-condominiums-by-facility/${facilityId}/${page}/${size}`
      );

      if (!result) {
        return initialState;
      }

      if (
        (result.data.status && result.data.status !== "OK") ||
        result.status !== 200
      ) {
        return initialState;
      }
      return result.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log(
          "FETCH CONDOMINIUMS BY FACILITY CANCELLED: ",
          error.message
        );
      }
    }
  }
);

const moreFacilityCondominiumsSlice = createSlice({
  name: "moreUnits",
  initialState,
  reducers: {
    // reseting the list of existing accommodations
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCondominiumsByFacility.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchCondominiumsByFacility.fulfilled,
        (state, action: PayloadAction<StateModel>) => {
          state.facilityCondominiums = action.payload.facilityCondominiums;
          state.page = action.payload.page;
          state.size = action.payload.size;
          state.totalElements = action.payload.totalElements;
          state.totalPages = action.payload.totalPages;
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(fetchCondominiumsByFacility.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// get all available facility accommodations
// export const getFacilityUnits = (state: {
//   facilityCondominiums: StateModel;
// }) => state.facilityCondominiums;

export const getMoreUnits = (state: { facilityCondominiums: StateModel }) =>
  state.facilityCondominiums;

export const getUnitById =
  (unitId: number) => (state: { facilityCondominiums: StateModel }) =>
    state.facilityCondominiums.facilityCondominiums.find((unit) =>
      Number(unit.accommodationId === unitId)
    );
export default moreFacilityCondominiumsSlice.reducer;
