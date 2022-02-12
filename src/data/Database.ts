import { firebaseApp } from "../config/FirebaseConfig"
import { getFirestore, collection, getDocs, setDoc, doc, Firestore, getDoc, query, DocumentData, QueryDocumentSnapshot, deleteDoc } from 'firebase/firestore/lite';
import { Pin, Location, PinDetails } from "./Pin"
import { IDatabase, IPin, ILocation, IDatabaseActionResult, IPinDetails, IPinResult } from "./Interfaces"

const pinDetailsConverter = {
    toFirestore: (details: IPinDetails) => {
        return {
            slacklineLength: details.slacklineLength,
            slacklineType: details.slacklineType,
            description: details.description
        };
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot) => {
        const data = snapshot.data();
        return new PinDetails(data.description, data.slacklineLength, data.slacklineType);
    }
}

// Firestore location data converter
const pinLocationConverter = {
    toFirestore: (location: ILocation) => {
        return {
            latitude: location.latitude,
            longitude: location.longitude
        };
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot) => {
        const data = snapshot.data();
        return new Location(data.latitude, data.longitude);
    }
}

// to convert the location string from the database back into a location object
function getLocationFromString(locationString: string): ILocation {

    const splitLocation: string[] = locationString.split(",", 2);

    return new Location(Number(splitLocation[0]), Number(splitLocation[1]));
}

const database = getFirestore(firebaseApp);

// Adds a pin to the database
async function addPin (pin: IPin) {
    const pinRef = doc(database, "pins", pin.location.toString());

    const pinDocSnap = await getDoc(pinRef);

        if (pinDocSnap.exists()) {
            console.log("could not place pin at location: " + pin.location + ". Because pin already exists");
            return
        }
        
    await setDoc(pinRef, (Object.assign({}, pin.details)));
}

// Edit pin at location
async function editPin (location: ILocation, details: PinDetails) {
    const pinRef = doc(database, "pins", location.toString());

    const pinDocSnap = await getDoc(pinRef);

    if (!pinDocSnap.exists()) {
        console.log("could not edit pin at location: " + location + ". Because pin does not exist");
        return
    }

    await setDoc(pinRef, (Object.assign({}, details), { merge: true}));
}

// deletes pin at given location
async function removePin (location: Location) {
    await deleteDoc(doc(database, "pins", location.toString()));
}

// Get a Location[] of all pins from the database
// Use getPinByLocation to get the details of the given pin
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

// Get the pin at a given location
async function getPinByLocation (location: Location) {
    const pinRef = doc(database, "pins", location.toString()).withConverter(pinDetailsConverter);

    const pinSnap = await getDoc(pinRef);
    const data = pinSnap.data();

    if (data != undefined) {
        return new Pin(location, new PinDetails(data.description, data.slacklineLength, data.slacklineType));
    }

    console.log("could not find data at location: " + location.toString());
}

export { addPin, getAllPinLocations, getPinByLocation, removePin, editPin }