import { IPinDetails, IPin } from "./Interfaces";
import { QueryDocumentSnapshot } from "firebase/firestore/lite";
import { PinDetails, Pin } from "./Pin";
import { GeoPoint } from "firebase/firestore/lite";

// data converters to transform data to and from json objects for firestore use
const pinDetailsConverter = {
  toFirestore: (details: IPinDetails) => {
    return {
      title: details.title,
      slacklineLength: details.slacklineLength,
      slacklineType: details.slacklineType,
      description: details.description,
      color: details.color,
      draggable: details.draggable,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    const details = snapshot.get("details");
    return new PinDetails(
      details.title,
      details.description,
      details.slacklineLength,
      details.slacklineType,
      details.color,
      details.draggable,
    );
  },
};

const pinCoordinateConverter = {
  toFirestore: (coordinate: GeoPoint) => {
    return coordinate.toJSON();
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    const coordinate = snapshot.get("coordinate");
    return new GeoPoint(coordinate.latitude, coordinate.longitude);
  },
};

const pinConverter = {
  toFirestore: (pin: IPin) => {
    return {
      coordinate: pinCoordinateConverter.toFirestore(pin.coordinate),
      details: pinDetailsConverter.toFirestore(pin.details),
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    return new Pin(
      pinCoordinateConverter.fromFirestore(snapshot),
      pinDetailsConverter.fromFirestore(snapshot)
    );
  },
};

export { pinConverter, pinCoordinateConverter, pinDetailsConverter };
