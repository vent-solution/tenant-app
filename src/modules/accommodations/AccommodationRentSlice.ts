import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchData } from "../../global/api";
import { RentModel } from "../rent/RentModel";

interface StateModel {
  tenantRent: RentModel[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  status: "idle" | "succeeded" | "loading" | "failed";
  error: string | null;
}

const initialState: StateModel = {
  tenantRent: [],
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
  status: "idle",
  error: null,
};

export const fetchAccommodationRent = createAsyncThunk(
  "fetchAccommodationRent",
  async ({
    tenantId,
    accommodationId,
    page,
    size,
  }: {
    tenantId: number;
    accommodationId: number;
    page: number;
    size: number;
  }) => {
    try {
      const result = await fetchData(
        `/fetch-rent-by-tenant-and-accommodation/${tenantId}/${accommodationId}/${page}/${size}`
      );

      console.log(result.data);

      if (!result) return initialState;

      if (
        (result.data.status && result.data.status !== "OK") ||
        result.status !== 200
      ) {
        return initialState;
      }
      return result.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH ACCOMMODATION RENT CANCELLED: ", error.message);
      }
    }
  }
);

const accommodationRentSlice = createSlice({
  name: "accommodationRent",
  initialState,
  reducers: {
    resetAccommodationRent: {
      reducer: (state, action: PayloadAction<StateModel>) => {
        state.tenantRent = action.payload.tenantRent;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      },

      prepare: (accommodationRentState: StateModel) => {
        return { payload: accommodationRentState };
      },
    },

    addNewRentRecord: {
      reducer: (state, action: PayloadAction<RentModel>) => {
        state.tenantRent.push(action.payload);
      },
      prepare: (rentRecord: RentModel) => {
        return { payload: rentRecord };
      },
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAccommodationRent.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchAccommodationRent.fulfilled,
        (state, action: PayloadAction<StateModel>) => {
          state.tenantRent = action.payload.tenantRent;
          state.page = action.payload.page;
          state.size = action.payload.size;
          state.totalElements = action.payload.totalElements;
          state.totalPages = action.payload.totalPages;
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(fetchAccommodationRent.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const getAccommodationRent = (state: {
  accommodationRent: StateModel;
}) => state.accommodationRent;

export const { resetAccommodationRent, addNewRentRecord } =
  accommodationRentSlice.actions;

export default accommodationRentSlice.reducer;
