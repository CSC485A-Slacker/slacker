import { firebaseApp } from "../config/FirebaseConfig"
import { getFirestore, collection, getDocs, setDoc, doc, Firestore, getDoc, query, DocumentData, QueryDocumentSnapshot, deleteDoc } from 'firebase/firestore/lite';
import { Pin, Location, PinDetails } from "./Pin"
import { IDatabase, IPin, ILocation, IDatabaseActionResult, IPinDetails, IPinResult } from "./Interfaces"

// Firestore details data converter
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

const database = getFirestore(firebaseApp);

// Adds a pin to the database
async function addPin (pin: IPin) {
    const pinRef = doc(database, "pins", pin.location.toString());
    await setDoc(pinRef, (Object.assign({}, pin.details)));
}

// deletes pin at given location
async function removePin (location: Location) {
    await deleteDoc(doc(database, "pins", location.toString()));
}

// Get a DocumentData[] of all pins from the database
// Can iterate through list to access pins
async function getAllPins () {
    const pinsCollection = collection(database, 'pins').withConverter(pinLocationConverter);
    const pinSnapshot = await getDocs(pinsCollection);

    const pinsList = pinSnapshot.docs.map(doc => doc.data());
    
    return pinsList;
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

export { addPin, getAllPins, getPinByLocation, removePin }