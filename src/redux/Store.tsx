import { configureStore } from "@reduxjs/toolkit";
import pinReducer from "./PinSlice";

export const store = configureStore({
  reducer: {
    pins: pinReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
