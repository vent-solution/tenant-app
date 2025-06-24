import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchData } from "../../global/api";
import { HistoryModel } from "../facilities/history/HistoryModel";
import { HistoryStatus } from "../../global/enums/historyStatus";

interface UpdateModel {
  id: number;
  changes: HistoryModel;
}

interface StateModel {
  tenantAccommodations: HistoryModel[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: StateModel = {
  tenantAccommodations: [],
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
  status: "idle",
  error: null,
};

// check tenant accommodations with pagination
export const fetchAccommodationsByTenant = createAsyncThunk(
  "fetchAccommodationsByTenant",
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
        `/fetch-accommodations-by-tenant/${userId}/${page}/${size}`
      );

      console.log(result.data);

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
      console.log("FETCH ACCOMMODATIONS BY TENANT CANCELLED: ", error);
      return initialState;
    }
  }
);

// fetch tenant accommodation on check in
export const fetchAccommodationOnCheckIn = createAsyncThunk(
  "fetchAccommodationOnCheckIn",
  async ({
    accommodationId,
    tenantId,
    status,
  }: {
    accommodationId: number;
    tenantId: number;
    status: HistoryStatus;
  }) => {
    try {
      const result = await fetchData(
        `/fetch-accommodation-on-check-in/${accommodationId}/${tenantId}/${status}`
      );

      if (!result) {
        return initialState;
      }

      if (result.status !== 200) {
        return initialState;
      }

      return result.data;
    } catch (error) {
      console.log("FETCH ACCOMMODATION ON CHECK IN CANCELLED: ", error);
      return initialState;
    }
  }
);

// tenant accommodations slice
const tenantAccommodationsSlice = createSlice({
  name: "tenantAccommodations",
  initialState,
  reducers: {
    //adding a new accommodation
    addAccommodation: {
      reducer: (state, action: PayloadAction<HistoryModel>) => {
        state.tenantAccommodations = [
          action.payload,
          ...state.tenantAccommodations,
        ];
        state.totalElements += 1;
      },

      prepare: (accommodationState: HistoryModel) => {
        return { payload: accommodationState };
      },
    },

    // updating accommodation
    updateAccommodation: {
      reducer: (state, action: PayloadAction<UpdateModel>) => {
        const { id, changes } = action.payload;

        const accommodationIndex = state.tenantAccommodations.findIndex(
          (accommodation) =>
            Number(accommodation.accommodation.accommodationId) === Number(id)
        );

        if (accommodationIndex >= 0) {
          state.tenantAccommodations[accommodationIndex] = {
            ...state.tenantAccommodations[accommodationIndex],
            ...changes,
          };
        }
      },

      prepare: (accommodation: UpdateModel) => {
        return { payload: accommodation };
      },
    },

    // deleting accommodation
    deleteAccommodation: {
      reducer: (state, action: PayloadAction<number>) => {
        state.totalElements -= 1;
        state.tenantAccommodations = state.tenantAccommodations.filter(
          (accommodation) =>
            Number(accommodation.accommodation.accommodationId) !==
            Number(action.payload)
        );
      },

      prepare: (accodationId: number) => {
        return { payload: accodationId };
      },
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAccommodationsByTenant.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchAccommodationsByTenant.fulfilled,
        (state, action: PayloadAction<StateModel>) => {
          state.tenantAccommodations = action.payload.tenantAccommodations;
          state.page = action.payload.page;
          state.size = action.payload.size;
          state.totalElements = action.payload.totalElements;
          state.totalPages = action.payload.totalPages;
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(fetchAccommodationsByTenant.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchAccommodationOnCheckIn.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchAccommodationOnCheckIn.fulfilled,
        (state, action: PayloadAction<HistoryModel>) => {
          state.tenantAccommodations = [
            action.payload,
            ...state.tenantAccommodations,
          ];
          state.totalElements += 1;
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(fetchAccommodationOnCheckIn.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// get all available facility accommodations
export const getTenantAccommodations = (state: {
  tenantAccommodations: StateModel;
}) => state.tenantAccommodations;

// get accommodation by ID
export const getAccommodationById =
  (accommodationId: number) => (state: { tenantAccommodations: StateModel }) =>
    state.tenantAccommodations.tenantAccommodations.find(
      (accommodation) =>
        accommodation.accommodation.accommodationId === accommodationId
    );

// get accommodation by tenant
export const getAccommodationByTenant =
  (tenantId: number) => (state: { tenantAccommodations: StateModel }) =>
    state.tenantAccommodations.tenantAccommodations.find(
      (fc) =>
        fc.accommodation.tenants &&
        fc.accommodation.tenants.find(
          (tnt) => Number(tnt.tenantId) === tenantId
        )
    );

export const { addAccommodation, updateAccommodation, deleteAccommodation } =
  tenantAccommodationsSlice.actions;

export default tenantAccommodationsSlice.reducer;
