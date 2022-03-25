import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Pin } from "../data/Pin";

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
    title: "Caddy Bay Liner",
    description: "Woah that's a big octopus!",
    slacklineLength: 10,
    slacklineType: "Trickline",
    color: "red",
    draggable: false,
  },
  reviews: [],
  photos: [],
  activity: {
    shareableSlackline: false,
    activeUsers: 0,
    totalUsers: 0,
  },
};

const examplePin2: Pin = {
  key: generateRandomKey(),
  coordinate: {
    latitude: 48.459405,
    longitude: -123.327318,
  },
  details: {
    title: "Mt Tomie",
    description: "Its pretty cool, nice views.",
    slacklineLength: 15,
    slacklineType: "Highline",
    color: "red",
    draggable: false,
  },
  reviews: [],
  photos: [],
  activity: {
    shareableSlackline: false,
    activeUsers: 0,
    totalUsers: 0,
  },
};

export interface PinsState {
  pins: Pin[];
}

const initialState: PinsState = {
  pins: [],
};

export const pinSlice = createSlice({
  name: "pins",
  initialState,
  reducers: {
    addPin: (state, action: PayloadAction<Pin>) => {
      if (!state.pins.find((pin) => pin.key == action.payload.key)) {
        state.pins.push(action.payload);
      }
    },
    updatePin: (state, action: PayloadAction<Pin>) => {
      state.pins = state.pins.map((pin) => {
        if (pin.key == action.payload.key) {
          return {
            ...pin,
            coordinate: action.payload.coordinate,
            details: {
              title: action.payload.details.title,
              description: action.payload.details.description,
              slacklineLength: action.payload.details.slacklineLength,
              slacklineType: action.payload.details.slacklineType,
              color: "red",
              draggable: false,
            },
            reviews: action.payload.reviews,
            photos: action.payload.photos,
            activity: action.payload.activity,
            privateViewers: action.payload.privateViewers,
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
