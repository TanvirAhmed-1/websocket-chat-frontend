import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TUserRole = "USER" | "ADMIN" | "SUPER_ADMIN" | "user" | "admin";

export type TUser = {
  id: string;
  name: string;
  username?: string;
  email: string;
  phone?: string;
  address?: string;
  bio?: string;
  role?: TUserRole;
  avatarUrl?: string;
};

export type TAuthState = {
  user: TUser | null;
  token: string | null;
  isAuthenticated: boolean;
};

const initialState: TAuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: TUser; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    setUser: (state, action: PayloadAction<TUser | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    updateProfile: (state, action: PayloadAction<Partial<TUser>>) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
    },
    updateAvatar: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.avatarUrl = action.payload;
      }
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const {
  setCredentials,
  setUser,
  updateProfile,
  updateAvatar,
  setToken,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
