import { firebaseApp } from "../config/FirebaseConfig"
import { getFirestore, collection, getDocs, setDoc, doc, getDoc, updateDoc, QueryDocumentSnapshot, deleteDoc } from 'firebase/firestore/lite';
import { Pin, Location, PinDetails } from "./Pin"
import { IPin, ILocation, IPinDetails, IDatabaseActionResult, IPinActionResult } from "./Interfaces"

const database = getFirestore(firebaseApp);

// Adds a pin to the database
async function addPin (pin: IPin) : Promise<IDatabaseActionResult> {
    const pinRef = doc(database, "pins", pin.location.toString());

    try {
        const pinDocSnap = await getDoc(pinRef);

        if (pinDocSnap.exists()) {
            throw new Error(`Pin already exists.`);
        }

        await setDoc(pinRef, pinConverter.toFirestore(pin));

    } catch(error) {
        return new DatabaseActionResult(false, `Failed: could not place pin at location: ${pin.location}. ${error}`);
    }

    return new DatabaseActionResult(true, `Succeeded: pin added at ${pin.location}`);
}

// Edits pin details at location
async function editPinDetails (location: ILocation, details: PinDetails) : Promise<IDatabaseActionResult> {

    try {
        const pinRef = doc(database, "pins", location.toString());
        const pinDocSnap = await getDoc(pinRef);

        if (!pinDocSnap.exists()) {
            throw new Error(`Pin could not be found.`);
        }

        await updateDoc(pinRef, { details: pinDetailsConverter.toFirestore(details)});

    } catch(error) {

        return new DatabaseActionResult(false, `Failed: could not edit pin at location ${location}. ${error}`);

    }

    return new DatabaseActionResult(true, `Succeeded: pin edited at ${location}`);
}

// Deletes pin at given location
async function deletePin (location: Location) : Promise<IDatabaseActionResult> {
    try {
        await deleteDoc(doc(database, "pins", location.toString()));

    } catch(error) {

        return new DatabaseActionResult(false, `Failed: could not delete pin at location ${location}. ${error}`);

    }

    return new DatabaseActionResult(true, `Succeeded: pin deleted at: ${location}`);
}

// Get the pin at a given location
async function getPin (location: Location): Promise<IPinActionResult<IPin>> {
    try {
        const pinRef = doc(database, "pins", location.toString());

        const pinDocSnap = await getDoc(pinRef);

        if (!pinDocSnap.exists()) {
            throw new Error(`Pin could not be found`);
        }

        const pin = pinConverter.fromFirestore(pinDocSnap);
        
        return new PinActionResult<IPin>(new DatabaseActionResult(true, `Succeeded: pin retrieved from ${location}`), pin);
        
    } catch(error){
        return new PinActionResult<IPin>(new DatabaseActionResult(false, `Failed: pin could not be retrieved from ${location}. ${error}`), undefined);
    }
}

// Get a pin[] of all pins from the database
async function getAllPins (): Promise<IPinActionResult<IPin[]>> {
    try {
        const pinsCollection = collection(database, 'pins').withConverter(pinConverter);

        const pinSnapshot = await getDocs(pinsCollection)

        const pinsList: Pin[] = [];
        
        // converts each document into a pin object
        pinSnapshot.forEach(pin => {
            pinsList.push(pin.data());
        });
        
        return new PinActionResult<IPin[]>(new DatabaseActionResult(true, `Succeeded: pins retrieved from ${location}`), pinsList);

    } catch(error) {
        return new PinActionResult<IPin[]>(new DatabaseActionResult(false, `Failed: pins could not be retrieved from ${location}. ${error}`), undefined);
    }
}

// Get a Location[] of all pins from the database without retreiving details
// Use getPin to get a specific pin
async function getAllPinLocations (): Promise<IPinActionResult<ILocation[]>> {
    try {
        const pinsCollection = collection(database, 'pins');

        const pinSnapshot = await getDocs(pinsCollection)

        const pinsList = pinSnapshot.docs.map(doc => doc.id);

        const pinLocationsList: Location[] = [];

        pinsList.forEach(pin => {
            pinLocationsList.push(getLocationFromString(pin));
        });
        
        return new PinActionResult<ILocation[]>(new DatabaseActionResult(true, `Succeeded: pin locations retrieved from ${location}`), pinLocationsList);

    } catch(error) {

        return new PinActionResult<ILocation[]>(new DatabaseActionResult(false, `Failed: pin locations could not be retrieved from ${location}. ${error}`), undefined);

    }
}

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

// to convert the location string from the database back into a location object
function getLocationFromString(locationString: string): ILocation {

    const splitLocation: string[] = locationString.split(",", 2);

    return new Location(Number(splitLocation[0]), Number(splitLocation[1]));
}

// action result implementations
class DatabaseActionResult implements IDatabaseActionResult {
    readonly succeeded: boolean;
    readonly message: string;

    constructor(succeeded: boolean, message: string) {
        this.succeeded = succeeded;
        this.message = message;
    }
}

class PinActionResult<T> implements IPinActionResult<T> {
    succeeded: boolean;
    message: string;
    data?: T;

    constructor(result: IDatabaseActionResult, data?: T) {
        this.succeeded = result.succeeded;
        this.message = result.message;
        this.data = data;
    }
}

 export { addPin, editPinDetails, deletePin, getPin, getAllPins, getAllPinLocations };

