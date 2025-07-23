import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AccommodationModel } from "../accommodations/AccommodationModel";
import axios from "axios";
import { fetchData } from "../../global/api";

interface StateModel {
  availableCondominiums: AccommodationModel[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: StateModel = {
  availableCondominiums: [],
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
  status: "idle",
  error: null,
};

export const fetchAvailableCondominiums = createAsyncThunk(
  "fetchAvailableCondominiums",
  async ({ page, size }: { page: number; size: number }) => {
    try {
      const result = await fetchData(
        `/fetch-available-condominiums/${page}/${size}`
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
      if (axios.isCancel(error)) {
        console.log("FETCH AVAILABLE UNITS CANCELLED: ", error.message);
      }
    }
  }
);

const condominiumsSlice = createSlice({
  name: "availableCondominiums",
  initialState,
  reducers: {
    addNewUnit: {
      reducer: (state, action: PayloadAction<AccommodationModel>) => {
        state.availableCondominiums = [
          action.payload,
          ...state.availableCondominiums,
        ];
      },

      prepare: (accommodation: AccommodationModel) => {
        return { payload: accommodation };
      },
    },

    updateUnit: {
      reducer: (state, action: PayloadAction<AccommodationModel>) => {
        const unitIndex = state.availableCondominiums.findIndex(
          (unit) =>
            Number(unit.accommodationId) ===
            Number(action.payload.accommodationId)
        );

        if (unitIndex >= 0) {
          state.availableCondominiums[unitIndex] = { ...action.payload };
        }
      },

      prepare: (accommodation: AccommodationModel) => {
        return { payload: accommodation };
      },
    },

    // delete unit if the landlord deletes the accommodation
    deleteUnit: {
      reducer: (state, action: PayloadAction<number>) => {
        state.availableCondominiums = state.availableCondominiums.filter(
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
        state.availableCondominiums = state.availableCondominiums.filter(
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
    builder.addCase(fetchAvailableCondominiums.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });

    builder.addCase(
      fetchAvailableCondominiums.fulfilled,
      (state, action: PayloadAction<StateModel>) => {
        state.availableCondominiums = action.payload.availableCondominiums;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
        state.status = "succeeded";
        state.error = null;
      }
    );

    builder.addCase(
      fetchAvailableCondominiums.rejected,
      (state, action: any) => {
        state.status = "failed";
        state.error = action.payload.error;
      }
    );
  },
});

export const { deleteUnitsByLandlord, addNewUnit, updateUnit, deleteUnit } =
  condominiumsSlice.actions;

export const getAvailableCondominiums = (state: {
  availableCondominiums: StateModel;
}) => state.availableCondominiums;

export const getAvailableCondominiumById =
  (accommodationId: number) => (state: { availableCondominiums: StateModel }) =>
    state.availableCondominiums.availableCondominiums.find(
      (unit) => Number(unit.accommodationId) === Number(accommodationId)
    );

export default condominiumsSlice.reducer;
