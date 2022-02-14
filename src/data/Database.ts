import { firebaseApp } from "../config/FirebaseConfig"
import { getFirestore, collection, getDocs, setDoc, doc, Firestore, getDoc, updateDoc, query, DocumentData, QueryDocumentSnapshot, deleteDoc } from 'firebase/firestore/lite';
import { Pin, Location, PinDetails } from "./Pin"
import { IPin, ILocation, IPinDetails } from "./Interfaces"

const database = getFirestore(firebaseApp);

// Adds a pin to the database
async function addPin (pin: IPin) {
    const pinRef = doc(database, "pins", pin.location.toString());

    const pinDocSnap = await getDoc(pinRef);

        if (pinDocSnap.exists()) {
            console.log("could not place pin at location: " + pin.location + ". Because pin already exists");
            return
        }

    await setDoc(pinRef, pinConverter.toFirestore(pin));
}

// Edit pin details at location
async function editPinDetails (location: ILocation, details: PinDetails) {

    const pinRef = doc(database, "pins", location.toString());

    const pinDocSnap = await getDoc(pinRef);

    if (!pinDocSnap.exists()) {
        console.log("could not edit pin at location: " + location + ". Because pin does not exist");
        return
    }

    await updateDoc(pinRef, { details: pinDetailsConverter.toFirestore(details)});
}

// deletes pin at given location
async function deletePin (location: Location) {
    await deleteDoc(doc(database, "pins", location.toString()));
}

// Get the pin at a given location
async function getPin (location: Location) {
    const pinRef = doc(database, "pins", location.toString()).withConverter(pinConverter);

    const pinDocSnap = await getDoc(pinRef);

    const pin = pinDocSnap.data();

    console.log("pin.location: " + pin?.location)

    if (pinDocSnap.exists()) {
        return pinDocSnap.data();
    }
    
    console.log("could not find data at location: " + location.toString());
}

// Get a pin[] of all pins from the database
async function getAllPins () {
    const pinsCollection = collection(database, 'pins').withConverter(pinConverter);

    const pinSnapshot = await getDocs(pinsCollection)

    const pinsList: Pin[] = [];

    pinSnapshot.forEach(pin => {
        pinsList.push(pin.data());
    });
    
    return pinsList;
}

// Get a Location[] of all pins from the database without retreiving details
// Use getPinByLocation to get the details of a pin
async function getAllPinLocations () {
    const pinsCollection = collection(database, 'pins');

    const pinSnapshot = await getDocs(pinsCollection)

    const pinsList = pinSnapshot.docs.map(doc => doc.id);
    const pinLocationsList: Location[] = [];

    pinsList.forEach(pin => {
        pinLocationsList.push(getLocationFromString(pin));
    });
    
    return pinLocationsList;
}

// data converters to transform data to and from json objects for firestore use
const pinDetailsConverter = {
    toFirestore: (details: IPinDetails) => {
        return {
            slacklineLength: details.slacklineLength,
            slacklineType: details.slacklineType,
            description: details.description
        };
    },
    // fromFirestore: (details: any) => {
    //     // const data = snapshot.data();
    //     return new PinDetails(details.description, details.slacklineLength, details.slacklineType);
    // }
}

// Firestore location data converter
const pinLocationConverter = {
  toFirestore: (location: ILocation) => {
    return {
      latitude: location.latitude,
      longitude: location.longitude,
    };
  },
//   fromFirestore: (snapshot: QueryDocumentSnapshot) => {
//     // const data = snapshot.data().location;
//     return new Location(snapshot.data().location.latitude, snapshot.data().location.longitude);
//   },
};

const pinConverter = {
  toFirestore: (pin: IPin) => {
    return {
      location: pinLocationConverter.toFirestore(pin.location),
      details: pinDetailsConverter.toFirestore(pin.details),
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    const data = snapshot.data();

    return new Pin(
      data.location,
      data.details
    );
  },
};

// to convert the location string from the database back into a location object
function getLocationFromString(locationString: string): ILocation {

    const splitLocation: string[] = locationString.split(",", 2);

    return new Location(Number(splitLocation[0]), Number(splitLocation[1]));
}

 export { addPin, editPinDetails, deletePin, getPin, getAllPins, getAllPinLocations };

