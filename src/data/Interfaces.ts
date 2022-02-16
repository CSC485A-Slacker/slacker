import { GeoPoint } from 'firebase/firestore/lite';

interface IPin {
  // https://firebase.google.com/docs/reference/node/firebase.firestore.GeoPoint
  readonly location: GeoPoint;
  details: IPinDetails;
}

interface IPinDetails {
    description: string;
    slacklineLength: number;
    slacklineType: string;
}

interface IDatabase {
  /* Purpose: attempts to add a pin to the database.
   *          Will fail if a pin exists with the sam location.
   * Return: an IDatabaseActionResult where success==true if the pin was
   *         was added at location.
   */
  addPin(pin: IPin): Promise<IDatabaseActionResult>;

  /* Purpose: attempts to edit a pin at the given location, replacing existing details with provided details.
   *          Will fail if no pin is found at location.
   * Return: an IDatabaseActionResult where success==true if the pin at location was deleted
   *         or success==false otherwise
   */
  editPinDetails(location: GeoPoint, details: IPinDetails): Promise<IDatabaseActionResult>;

  /* Purpose: attempts to delete a pin at the given location.
   *          Will fail if no pin is found at location.
   * Return: an IDatabaseActionResult where success==true if the pin at location was deleted
   *        or false otherwise
   */
  deletePin(location: GeoPoint): Promise<IDatabaseActionResult>;

  /* Purpose: attempts to get a pin from the given location.
   *          Will fail if no pin is found at location.
   * Return: an IPinActionResult<IPin> that will contain an IPin on success (undefined on failure)
   */
  getPin(location: GeoPoint): Promise<IPinActionResult<IPin>>;

  /* Purpose: attempts to get an array of all pins from the database.
   * Return: an IPinActionResult<IPin[]> that will contain an IPin[] on success (undefined on failure)
   */
  getAllPins(): Promise<IPinActionResult<IPin[]>>;

  /* Purpose: attempts to get an array of all pin locations (GeoPoints) from the database.
   * Return: an IPinActionResult<GeoPoint[]> that will contain a GeoPoint[] on success (undefined on failure)
   */
  getAllPinLocations(): Promise<IPinActionResult<GeoPoint[]>>;
}

/* 
 * Purpose: used as a return value for database access functions to provide info about the result
 * succeeded: true if action completed without error, false otherwise
 * message: Error message
*/
interface IDatabaseActionResult {
    succeeded: boolean;
    message: string;
}

/*
 * Purpose: contains IDatabaseActionResult info (succeeded and message)
 * data: contains data of specified type if succeeded, otherwise undefined
*/
interface IPinActionResult<T> extends IDatabaseActionResult {
    data?: T;
}

export { IPin, IPinDetails, IPinActionResult, IDatabase, IDatabaseActionResult }