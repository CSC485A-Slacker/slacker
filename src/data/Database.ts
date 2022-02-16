import { firebaseApp } from "../config/FirebaseConfig"
import { getFirestore, collection, getDocs, setDoc, doc, getDoc, updateDoc, deleteDoc, Firestore } from 'firebase/firestore/lite';
import { Pin, PinDetails, locationToString, locationFromString } from "./Pin"
import { IPin, IDatabaseActionResult, IPinActionResult, IDatabase } from "./Interfaces"
import { pinConverter, pinDetailsConverter } from "./DataConverters";
import { GeoPoint } from "firebase/firestore/lite";


class Database implements IDatabase {
    database: Firestore;

    constructor() {
        this.database = getFirestore(firebaseApp);
    }

    // Adds a pin to the database
    async addPin(pin: IPin): Promise<IDatabaseActionResult> {
        const pinRef = doc(this.database, "pins", locationToString(pin.location));

        try {
        const pinDocSnap = await getDoc(pinRef);

        if (pinDocSnap.exists()) {
            throw new Error(`Pin already exists.`);
        }

        await setDoc(pinRef, pinConverter.toFirestore(pin));
        } catch (error) {
        return new DatabaseActionResult(
          false,
          `Failed: could not place pin at location: ${locationToString(
            pin.location
          )}. ${error}`
        );
        }

        return new DatabaseActionResult(
          true,
          `Succeeded: pin added at ${locationToString(pin.location)}`
        );
    }

    // Edits pin details at location
    async editPinDetails(location: GeoPoint,details: PinDetails): Promise<IDatabaseActionResult> {
        try {
        const pinRef = doc(this.database, "pins", locationToString(location));
        const pinDocSnap = await getDoc(pinRef);

        if (!pinDocSnap.exists()) {
            throw new Error(`Pin could not be found.`);
        }

        await updateDoc(pinRef, { details: pinDetailsConverter.toFirestore(details) });
        } catch (error) {
        return new DatabaseActionResult(
          false,
          `Failed: could not edit pin at location ${locationToString(location)}. ${error}`);
        }

        return new DatabaseActionResult(true, `Succeeded: pin edited at ${locationToString(location)}`);
    }

    // Deletes pin at given location
    async deletePin(location: GeoPoint): Promise<IDatabaseActionResult> {
        try {
            const pinRef = doc(this.database, "pins", locationToString(location));
            const pinDocSnap = await getDoc(pinRef);

            if (!pinDocSnap.exists()) {
                throw new Error(`Pin could not be found.`);
            }
            await deleteDoc(pinRef);

        } catch (error) {

        return new DatabaseActionResult(false, `Failed: could not delete pin at location ${locationToString(location)}. ${error}`);

        }

        return new DatabaseActionResult(
        true,
        `Succeeded: pin deleted at: ${locationToString(location)}`
        );
    }

    // Get the pin at a given location
    async getPin(location: GeoPoint): Promise<IPinActionResult<IPin>> {
        try {
        const pinRef = doc(this.database, "pins", locationToString(location));

        const pinDocSnap = await getDoc(pinRef);

        if (!pinDocSnap.exists()) {
            throw new Error(`Pin could not be found`);
        }

        const pin = pinConverter.fromFirestore(pinDocSnap);

        return new PinActionResult<IPin>(
          new DatabaseActionResult(
            true,
            `Succeeded: pin retrieved from ${locationToString(location)}`
          ),
          pin
        );
        } catch (error) {
        return new PinActionResult<IPin>(
            new DatabaseActionResult(
            false,
            `Failed: pin could not be retrieved from ${locationToString(location)}. ${error}`
            ),
            undefined
        );
        }
    }

  // Get a pin[] of all pins from the database
  async getAllPins(): Promise<IPinActionResult<IPin[]>> {
    try {
      const pinsCollection = collection(this.database, "pins").withConverter(
        pinConverter
      );

      const pinSnapshot = await getDocs(pinsCollection);

      const pinsList: Pin[] = [];

      // converts each document into a pin object
      pinSnapshot.forEach((pin) => {
        pinsList.push(pin.data());
      });

      return new PinActionResult<IPin[]>(
        new DatabaseActionResult(
          true,
          `Succeeded: pins retrieved`
        ),
        pinsList
      );
    } catch (error) {
      return new PinActionResult<IPin[]>(
        new DatabaseActionResult(
          false,
          `Failed: pins could not be retrieved. ${error}`
        ),
        undefined
      );
    }
  }

  // Get a Location[] of all pins from the database without retreiving details
  // Use getPin to get a specific pin
  async getAllPinLocations(): Promise<IPinActionResult<GeoPoint[]>> {
    try {
      const pinsCollection = collection(this.database, "pins");

      const pinSnapshot = await getDocs(pinsCollection);

      const pinsList = pinSnapshot.docs.map((doc) => doc.id);

      const pinLocationsList: GeoPoint[] = [];

      pinsList.forEach((pin) => {
        pinLocationsList.push(locationFromString(pin));
      });

      return new PinActionResult<GeoPoint[]>(
        new DatabaseActionResult(
          true,
          `Succeeded: pin locations retrieved.`
        ),
        pinLocationsList
      );
    } catch (error) {
      return new PinActionResult<GeoPoint[]>(
        new DatabaseActionResult(
          false,
          `Failed: pin locations could not be retrieved. ${error}`
        ),
        undefined
      );
    }
  }
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

 export { Database };

