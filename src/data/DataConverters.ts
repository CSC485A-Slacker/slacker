import { IPinDetails, IPin } from "./Interfaces";
import { QueryDocumentSnapshot } from "firebase/firestore/lite";
import { PinDetails, Pin } from "./Pin";
import { GeoPoint } from "firebase/firestore/lite";

// data converters to transform data to and from json objects for firestore use
const pinDetailsConverter = {
  toFirestore: (details: IPinDetails) => {
    return {
      slacklineLength: details.slacklineLength,
      slacklineType: details.slacklineType,
      description: details.description,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    const details = snapshot.get("details");
    return new PinDetails(
      details.description,
      details.slacklineLength,
      details.slacklineType
    );
  },
};

const pinLocationConverter = {
  toFirestore: (location: GeoPoint) => {
    return location.toJSON();
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    const location = snapshot.get("location");
    return new GeoPoint(location.latitude, location.longitude);
  },
};

const pinConverter = {
  toFirestore: (pin: IPin) => {
    return {
      location: pinLocationConverter.toFirestore(pin.location),
      details: pinDetailsConverter.toFirestore(pin.details),
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {

    return new Pin(
      pinLocationConverter.fromFirestore(snapshot),
      pinDetailsConverter.fromFirestore(snapshot)
    );
  },
};

export { pinConverter, pinLocationConverter, pinDetailsConverter }