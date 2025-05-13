import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AccommodationModel } from "../accommodations/AccommodationModel";
import axios from "axios";
import { fetchData } from "../../global/api";

interface StateModel {
  availableUnits: AccommodationModel[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: StateModel = {
  availableUnits: [],
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
  status: "idle",
  error: null,
};

export const fetchAvailableUnits = createAsyncThunk(
  "fetchAvailableUnits",
  async ({ page, size }: { page: number; size: number }) => {
    try {
      const result = await fetchData(`/fetch-available-units/${page}/${size}`);

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
      if (axios.isCancel(error)) {
        console.log("FETCH AVAILABLE UNITS CANCELLED: ", error.message);
      }
    }
  }
);

const unitsSlice = createSlice({
  name: "availableUnits",
  initialState,
  reducers: {
    resetAvailableUnits: {
      reducer: (state, action: PayloadAction<StateModel>) => {
        state.availableUnits = action.payload.availableUnits;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
        state.error = null;
        state.status = "succeeded";
      },

      prepare: (availableUnits: StateModel) => {
        return { payload: availableUnits };
      },
    },

    addNewUnit: {
      reducer: (state, action: PayloadAction<AccommodationModel>) => {
        state.availableUnits = [action.payload, ...state.availableUnits];
      },

      prepare: (accommodation: AccommodationModel) => {
        return { payload: accommodation };
      },
    },

    updateUnit: {
      reducer: (state, action: PayloadAction<AccommodationModel>) => {
        const unitIndex = state.availableUnits.findIndex(
          (unit) =>
            Number(unit.accommodationId) ===
            Number(action.payload.accommodationId)
        );

        if (unitIndex >= 0) {
          state.availableUnits[unitIndex] = { ...action.payload };
        }
      },

      prepare: (accommodation: AccommodationModel) => {
        return { payload: accommodation };
      },
    },

    // delete unit if the landlord deletes the accommodation
    deleteUnit: {
      reducer: (state, action: PayloadAction<number>) => {
        state.availableUnits = state.availableUnits.filter(
          (unit) => Number(unit.accommodationId) !== Number(action.payload)
        );

        state.totalElements -= 1;
      },

      prepare: (accommodationId: number) => {
        return { payload: accommodationId };
      },
    },

    // delete unit if landlord is blocked or deleted
    deleteUnitsByLandlord: {
      reducer: (state: StateModel, action: PayloadAction<number>) => {
        state.availableUnits = state.availableUnits.filter(
          (unit) =>
            Number(unit.facility.landlord?.user?.userId) !==
            Number(action.payload)
        );
      },

      prepare: (landlordId: number) => {
        return { payload: landlordId };
      },
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchAvailableUnits.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });

    builder.addCase(
      fetchAvailableUnits.fulfilled,
      (state, action: PayloadAction<StateModel>) => {
        state.availableUnits = action.payload.availableUnits;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
        state.status = "succeeded";
        state.error = null;
      }
    );

    builder.addCase(fetchAvailableUnits.rejected, (state, action: any) => {
      state.status = "failed";
      state.error = action.payload.error;
    });
  },
});

export const {
  resetAvailableUnits,
  deleteUnitsByLandlord,
  addNewUnit,
  updateUnit,
  deleteUnit,
} = unitsSlice.actions;

export const getAvailableUnits = (state: { availableUnits: StateModel }) =>
  state.availableUnits;

export const getAvailableUnitById =
  (accommodationId: number) => (state: { availableUnits: StateModel }) =>
    state.availableUnits.availableUnits.find(
      (unit) => Number(unit.accommodationId) === Number(accommodationId)
    );

export default unitsSlice.reducer;
