import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LatLng } from "react-native-maps";

export type Pin = {
  key: number;
  coordinate: LatLng;
  color: string;
  draggable: boolean;
  title: string;
  length: number;
  type: string;
  description: string;
};

export function generateRandomKey() {
  return Date.now() + Math.random();
}

// TODO: Remove hardcoded examples after integration with backend
const examplePin1: Pin = {
  key: generateRandomKey(),
  coordinate: {
    latitude: 48.458494,
    longitude: -123.29526,
  },
  color: "red",
  draggable: false,
  title: "Caddy Bay Liner",
  length: 10,
  type: "Trickline",
  description: "Woah that's a big octopus!",
};

const examplePin2: Pin = {
  key: generateRandomKey(),
  coordinate: {
    latitude: 48.459405,
    longitude: -123.327318,
  },
  color: "red",
  draggable: false,
  title: "Mt Tomie",
  length: 15,
  type: "Highline",
  description: "Its pretty cool, nice views.",
};

export interface PinsState {
  pins: Pin[];
}

const initialState: PinsState = {
  pins: [examplePin1, examplePin2],
};

export const pinSlice = createSlice({
  name: "pins",
  initialState,
  reducers: {
    addPin: (state, action: PayloadAction<Pin>) => {
      state.pins.push(action.payload);
    },
    updatePin: (state, action: PayloadAction<Pin>) => {
      state.pins = state.pins.map((pin) => {
        if (pin.key == action.payload.key) {
          return {
            ...pin,
            coordinate: action.payload.coordinate,
            color: "red",
            draggable: false,
            title: action.payload.title,
            description: action.payload.description,
            length: action.payload.length,
            type: action.payload.type,
          };
        }
        return pin;
      });
    },
    removePin: (state, action: PayloadAction<Pin>) => {
      state.pins = state.pins.filter((pin) => pin.key != action.payload.key);
    },
  },
});

export const { addPin, updatePin, removePin } = pinSlice.actions;

export default pinSlice.reducer;
