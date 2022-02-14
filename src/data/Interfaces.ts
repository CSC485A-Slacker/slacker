import { addPin } from "./Database"
import { GeoPoint } from 'firebase/firestore/lite';
import { Pin } from "./Pin";

interface IPin {
    readonly location: ILocation;
    details: IPinDetails;
}

interface ILocation {
    readonly latitude: number;
    readonly longitude: number;

    isEqual(other: ILocation): boolean;

    // used to search the database by location
    toString (): string;
}

interface IPinDetails {
    description: string;
    slacklineLength: number;
    slacklineType: string;
}

//  TODO: fix interfaces so that they represent Database.ts functions

interface IDatabase {
    // attempts to add a pin at a given location.
    // returns an IDatabaseAction result.
    // will fail if a pin already exists
    addPin(pin: IPin): IDatabaseActionResult;

    // attempts to edit a pin at a given location, replacing existing details with provided details.
    // returns an IDatabaseAction result.
    // will fail if no pin exists
    editPinDetials(pin: ILocation, details: IPinDetails): IDatabaseActionResult;

    // attempts to remove the pin at a given location.
    // returns an IDatabaseAction result.
    removePin(location: ILocation): Promise<IDatabaseActionResult>;

    // returns a list of all pins
    getAllPins(): IPin[];

    // returns a pin by its location
    getPin(location: ILocation): Promise<IPinResult>;

}

// succeeded returns true if the action was complete, false otherwise
// message contains information about the result (such as why an action failed)
interface IDatabaseActionResult {
    succeeded: boolean;
    message: string;
}

// returns the result of attemping to get a pin
// returns the pin on success, or an empty pin on failure
interface IPinResult {
    result: IDatabaseActionResult,
    pin: IPin;
}

export { IPin, ILocation, IPinDetails, IPinResult, IDatabase, IDatabaseActionResult }