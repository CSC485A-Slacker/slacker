import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import pinReducer from "./PinSlice";

export const store = configureStore({
  reducer: {
    pins: pinReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck:false})
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
