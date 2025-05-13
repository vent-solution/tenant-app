// usersSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserModel } from "./models/userModel";

interface UpdateModel {
  id: string | undefined;
  changes: UserModel;
}

// users state type
interface UserState {
  tenantUser: UserModel;
  status: string;
  error: string | null;
}

// initial users state
const initialState: UserState = {
  tenantUser: {},
  status: "idle",
  error: null,
};

// create users slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // update a user
    updateUser: {
      reducer(state, action: PayloadAction<UpdateModel>) {
        const { changes } = action.payload;

        state.tenantUser = { ...changes };
      },

      prepare(user: UpdateModel) {
        return { payload: user };
      },
    },
  },
});
export const getUser = (state: { user: UserState }) => state.user.tenantUser;

export const { updateUser } = userSlice.actions;

export default userSlice.reducer;
