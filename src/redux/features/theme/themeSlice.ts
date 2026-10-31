import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TThemeMode = "light" | "dark" | "system";
export type TAccentColor = "purple" | "indigo" | "blue" | "emerald" | "rose";

export interface IThemeState {
  mode: TThemeMode;
  accent: TAccentColor;
}

const initialState: IThemeState = {
  mode: "light",
  accent: "purple",
};

export const ACCENT_COLORS: Record<
  TAccentColor,
  { name: string; hex: string; ring: string; gradient: string }
> = {
  purple: {
    name: "Royal Purple",
    hex: "#6E00FF",
    ring: "ring-[#6E00FF]",
    gradient: "from-[#6E00FF] to-[#8B5CF6]",
  },
  indigo: {
    name: "Electric Indigo",
    hex: "#4F46E5",
    ring: "ring-[#4F46E5]",
    gradient: "from-[#4F46E5] to-[#6366F1]",
  },
  blue: {
    name: "Ocean Blue",
    hex: "#0284C7",
    ring: "ring-[#0284C7]",
    gradient: "from-[#0284C7] to-[#38BDF8]",
  },
  emerald: {
    name: "Emerald Green",
    hex: "#059669",
    ring: "ring-[#059669]",
    gradient: "from-[#059669] to-[#34D399]",
  },
  rose: {
    name: "Rose Pink",
    hex: "#E11D48",
    ring: "ring-[#E11D48]",
    gradient: "from-[#E11D48] to-[#FB7185]",
  },
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<TThemeMode>) => {
      state.mode = action.payload;
    },
    setAccentColor: (state, action: PayloadAction<TAccentColor>) => {
      state.accent = action.payload;
    },
  },
});

export const { setThemeMode, setAccentColor } = themeSlice.actions;
export default themeSlice.reducer;

