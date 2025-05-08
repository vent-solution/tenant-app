import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HistoryModel } from "./HistoryModel";
import axios from "axios";
import { fetchData } from "../../global/api";

interface StateModel {
  tenantHistory: HistoryModel[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: StateModel = {
  tenantHistory: [],
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
  status: "idle",
  error: null,
};

export const fetchTenantHistory = createAsyncThunk(
  "fetchTenantHistory",
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
        `/fetch-history-by-tenant/${userId}/${page}/${size}`
      );

      if (
        (result.data.status && result.data.status !== "Ok") ||
        result.status !== 200
      ) {
        return initialState;
      }

      return result.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH TENANT HISTORY CANCELLED: ", error.message);
      }
    }
  }
);

const tenantHistorySlice = createSlice({
  name: "tenantHistory",
  initialState,
  reducers: {
    resetTenantHistory: {
      reducer: (state, action: PayloadAction<StateModel>) => {
        state.tenantHistory = action.payload.tenantHistory;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      },

      prepare: (tenantHistory: StateModel) => {
        return { payload: tenantHistory };
      },
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTenantHistory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchTenantHistory.fulfilled,
        (state, action: PayloadAction<StateModel>) => {
          state.tenantHistory = action.payload.tenantHistory;
          state.page = action.payload.page;
          state.size = action.payload.size;
          state.totalElements = action.payload.totalElements;
          state.totalPages = action.payload.totalPages;
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(fetchTenantHistory.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const getTenantHistory = (state: { tenantHistory: StateModel }) =>
  state.tenantHistory;

export const { resetTenantHistory } = tenantHistorySlice.actions;

export default tenantHistorySlice.reducer;
