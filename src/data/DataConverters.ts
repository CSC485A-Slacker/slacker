import { IPinDetails, ILocation, IPin } from "./Interfaces";
import { QueryDocumentSnapshot } from "firebase/firestore/lite";
import { PinDetails, Pin, Location } from "./Pin";


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
  toFirestore: (location: ILocation) => {
    return {
      latitude: location.latitude,
      longitude: location.longitude,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    const location = snapshot.get("location");
    return new Location(location.latitude, location.longitude);
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