import { GeoPoint } from 'firebase/firestore/lite';

interface IPin {
    readonly location: GeoPoint;
    details: IPinDetails;
}

// interface ILocation {
//     readonly latitude: number;
//     readonly longitude: number;

//     isEqual(other: ILocation): boolean;
//     toString (): string;
// }

interface IPinDetails {
    description: string;
    slacklineLength: number;
    slacklineType: string;
}

interface IDatabase {
  // attempts to add a pin at a given location.
  // returns an IDatabaseAction result.
  // will fail if a pin already exists
  addPin(pin: IPin): Promise<IDatabaseActionResult>;

  // attempts to edit a pin at a given location, replacing existing details with provided details.
  // returns an IDatabaseAction result.
  // will fail if no pin exists
  editPinDetails(pin: GeoPoint, details: IPinDetails): Promise<IDatabaseActionResult>;

  // attempts to remove the pin at a given location.
  // returns an IDatabaseAction result.
  deletePin(location: GeoPoint): Promise<IDatabaseActionResult>;

  // returns a pin by its location
  getPin(location: GeoPoint): Promise<IPinActionResult<IPin>>;

  // returns a list of all pins
  getAllPins(): Promise<IPinActionResult<IPin[]>>;

  // returns a Location[] containing all pin locations
  getAllPinLocations(): Promise<IPinActionResult<GeoPoint[]>>;
}

// succeeded returns true if the action was complete, false otherwise
// message contains information about the result (such as why an action failed)
interface IDatabaseActionResult {
    succeeded: boolean;
    message: string;
}

// returns the result of attemping to get a pin
// returns the pin on success, or an empty pin on failure
interface IPinActionResult<T> extends IDatabaseActionResult {
    data?: T;
}

export { IPin, IPinDetails, IPinActionResult, IDatabase, IDatabaseActionResult }