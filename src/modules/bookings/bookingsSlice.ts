import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BookingModel } from "./BookingModel";
import axios from "axios";
import { fetchData } from "../../global/api";

interface StateModel {
  tenantBookings: BookingModel[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  status: "idle" | "succeeded" | "loading" | "failed";
  error: string | null;
}

const initialState: StateModel = {
  tenantBookings: [],
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
  status: "idle",
  error: null,
};

export const fetchTenantBookings = createAsyncThunk(
  "fetchTenantBookings",
  async ({
    userId,
    page,
    size,
  }: {
    userId: number;
    page: number;
    size: number;
  }) => {
    try {
      const result = await fetchData(
        `/fetch-bookings-by-tenant/${userId}/${page}/${size}`
      );

      console.log(result.data);

      if (
        (result.data.status && result.data.status !== "OK") ||
        result.status !== 200
      ) {
        return initialState;
      }
      return result.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH TENANT BOOKINGS CANCELLED: ", error.message);
      }
    }
  }
);

const tenantBookingsSlice = createSlice({
  name: "tenantBookings",
  initialState,
  reducers: {
    resetTenantBookings: {
      reducer: (state, action: PayloadAction<StateModel>) => {
        state.tenantBookings = action.payload.tenantBookings;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      },
      prepare: (tenantBookingsState: StateModel) => {
        return { payload: tenantBookingsState };
      },
    },

    addNewBooking: {
      reducer: (state, action: PayloadAction<BookingModel>) => {
        state.tenantBookings.push(action.payload);
      },

      prepare: (booking: BookingModel) => ({ payload: booking }),
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTenantBookings.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchTenantBookings.fulfilled,
        (state, action: PayloadAction<StateModel>) => {
          state.tenantBookings = action.payload.tenantBookings;
          state.page = action.payload.page;
          state.size = action.payload.size;
          state.totalElements = action.payload.totalElements;
          state.totalPages = action.payload.totalPages;
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(fetchTenantBookings.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const getTenantBookings = (state: { tenantBookings: StateModel }) =>
  state.tenantBookings;

export const { resetTenantBookings } = tenantBookingsSlice.actions;

export default tenantBookingsSlice.reducer;
