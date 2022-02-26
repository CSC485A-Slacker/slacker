import { LatLng } from "react-native-maps";

interface IPin {
  key: number;
  readonly coordinate: LatLng;
  details: IPinDetails;
  reviews: IPinReviews[];
  photos: IPinPhotos[];
  activity: IPinActivity;
}

interface IPinDetails {
  title: string;
  description: string;
  slacklineLength: number;
  slacklineType: string;
  color: string;
  draggable: boolean;
}

interface IPinReviews {
  comment: string;
  rating: number;
  date: Date;
}

interface IPinPhotos {
  url: string;
  date: Date;
}

interface IPinActivity {
  checkIn: boolean;
  activeUsers: number;
  totalUsers: number;
}

interface IDatabase {
  /* Purpose: attempts to add a pin to the database.
   *          Will fail if a pin exists with the same coordinate.
   *
   * Return: an IDatabaseActionResult where success==true if the pin was
   *         was added at coordinate.
   */
  addPin(pin: IPin): Promise<IDatabaseActionResult>;

  /* Purpose: attempts to edit a pin at the given coordinate, replacing existing details with provided details.
   *          Will fail if no pin is found at coordinate.
   *
   * Return: an IDatabaseActionResult where success==true if the pin at coordinate was deleted
   *         or success==false otherwise
   */
  editPinDetails(
    coordinate: LatLng,
    details: IPinDetails
  ): Promise<IDatabaseActionResult>;

  /* Purpose: attempts to delete a pin at the given coordinate.
   *          Will fail if no pin is found at coordinate.
   *
   * Return: an IDatabaseActionResult where success==true if the pin at coordinate was deleted
   *        or false otherwise
   */
  deletePin(coordinate: LatLng): Promise<IDatabaseActionResult>;

  /* Purpose: attempts to get a pin from the given coordinate.
   *          Will fail if no pin is found at coordinate.
   *
   * Return: an IPinActionResult<IPin> that will contain an IPin on success (undefined on failure)
   */
  getPin(coordinate: LatLng): Promise<IPinActionResult<IPin>>;

  /* Purpose: attempts to get an array of all pins from the database.
   *
   * Return: an IPinActionResult<IPin[]> that will contain an IPin[] on success (undefined on failure)
   */
  getAllPins(): Promise<IPinActionResult<IPin[]>>;

  /* Purpose: attempts to get an array of all pin coordinates (LatLng) from the database.
   *
   * Return: an IPinActionResult<LatLng[]> that will contain a LatLng[] on success (undefined on failure)
   */
  getAllPinCoordinates(): Promise<IPinActionResult<LatLng[]>>;
}

/*
 * Purpose: used as a return value for database access functions to provide info about the result
 *
 * succeeded: true if action completed without error, false otherwise
 * message: Error message
 */
interface IDatabaseActionResult {
  succeeded: boolean;
  message: string;
}

/*
 * Purpose: contains IDatabaseActionResult info (succeeded and message)
 *
 * data: contains data of specified type if succeeded, otherwise undefined
 */
interface IPinActionResult<T> extends IDatabaseActionResult {
  data?: T;
}

export {
  IPin,
  IPinDetails,
  IPinReviews,
  IPinPhotos,
  IPinActivity,
  IPinActionResult,
  IDatabase,
  IDatabaseActionResult,
};
