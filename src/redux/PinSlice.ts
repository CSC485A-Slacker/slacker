import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LatLng } from "react-native-maps";

export type Pin = {
  key: number;
  coordinate: LatLng;
  details: {
    color: string;
    draggable: boolean;
    title: string;
    description: string;
    slacklineLength: number;
    slacklineType: string;
  }
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
  details: {
    color: "red",
    draggable: false,
    title: "Caddy Bay Liner",
    description: "Woah that's a big octopus!",
    slacklineLength: 10,
    slacklineType: "Trickline",
  }
};

const examplePin2: Pin = {
  key: generateRandomKey(),
  coordinate: {
    latitude: 48.459405,
    longitude: -123.327318,
  }, 
  details: {
    color: "red",
    draggable: false,
    title: "Mt Tomie",
    description: "Its pretty cool, nice views.",
    slacklineLength: 15,
    slacklineType: "Highline",
  }
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
            details: {
              color: "red",
              draggable: false,
              title: action.payload.details.title,
              description: action.payload.details.description,
              slacklineLength: action.payload.details.slacklineLength,
              slacklineType: action.payload.details.slacklineType,
            }
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
