import { firebaseApp } from "../config/FirebaseConfig"
import { getFirestore, collection, getDocs, setDoc, doc, getDoc, updateDoc, deleteDoc, Firestore, query } from 'firebase/firestore/lite';
import { Pin, PinDetails, coordinateToString, coordinateFromString, PinReview, PinPhoto, PinActivity } from "./Pin"
import { IPin, IDatabaseActionResult, IPinActionResult, IDatabase, IUser, IUserActionResult } from "./Interfaces"
import { pinActivityConverter, pinConverter, pinDetailsConverter, pinPhotosConverter, pinReviewsConverter, userConverter } from "./DataConverters";
import { Coordinate, LatLng } from "react-native-maps";
import { onSnapshot, Timestamp } from "@firebase/firestore";
import {
  addPin,
  removePin,
  updatePin,
} from "../redux/PinSlice";
import { store } from "../redux/Store"
import { User, userIsCheckedIntoSpot } from "./User";

class Database implements IDatabase {
    database: Firestore;

    constructor() {
        this.database = getFirestore(firebaseApp);
    }

    async addUser(user: IUser) {
      const userDocRef = doc(this.database, "users", user._userID)
        try
        {
          const userSnap =await getDoc(userDocRef)
          if(userSnap.exists())
          {
            throw new Error(`User already existed with ID ${user._userID}`)
          }
          await setDoc(userDocRef, {userID: user._userID, checkInSpot: user._checkInSpot, checkOutTime: user._checkOutTime, username:user._username})
        } catch (e) {
          console.log("Error adding user: ", e);
        }
    }

    async getAllUsers(): Promise<IUserActionResult<IUser[]>>
    {
      try {
        const pinsCollection = collection(this.database, "users").withConverter(userConverter)
  
        const pinSnapshot = await getDocs(pinsCollection);
  
        const userList: User[] = [];
  
        // converts each document into a pin object
        pinSnapshot.forEach((user) => {
          userList.push(user.data());
        });
  
        return new UserActionResult<IUser[]>(
          new DatabaseActionResult(
            true,
            `Succeeded: users retrieved`
          ),
          userList
        );
      } catch (error) {
        return new UserActionResult<IUser[]>(
          new DatabaseActionResult(
            false,
            `Failed: users could not be retrieved. ${error}`
          ),
          undefined
        );
      }
    }

    async getUser(userID: string): Promise<IUserActionResult<IUser>> {
      const userDocRef = doc(this.database, "users", userID)
      try
      {
        const userDocSnap = await getDoc(userDocRef)
        if (!userDocSnap.exists())
        {
          throw new Error(`User with ID ${userID} doesn't exist`)
        }
        
        // console.log(userDocSnap)
        const usr = userConverter.fromFirestore(userDocSnap);
        // console.log(usr)

        return new UserActionResult<IUser>(
          new DatabaseActionResult(
            true,
            `Succeeded: user ${userDocSnap.get('userID')}`
          ),
          usr
        );
      } catch (error) {
        return new UserActionResult<IUser>(
          new DatabaseActionResult(
            false,
            `Failed: user ${userID} could not be retrieved from the database. ${error}`
          ),
          undefined
        );
      }
    }

    async ChangeCheckInSpot(userID:string, newLocation:LatLng, hoursToCheckInFor: number): Promise<IDatabaseActionResult>
    {
        const userDocRef = doc(this.database, "users", userID)
        const userResult = await this.getUser(userID)
        const user = userResult.data

        try
        {
            const userDocSnap = await getDoc(userDocRef)
            if(!user) {
                throw new Error("User doesn't exist")
            }

            const previousLocation = user._checkInSpot

            if(previousLocation) {
                // exit if user is already checked into new spot
                if(userIsCheckedIntoSpot(user, newLocation)) {
                    alert(`You are already checked in here!`);
                    throw new Error(`User already checked into spot ${coordinateToString(newLocation)}.`);
                }

                // checkout from previous
                await this.checkoutFromSpot(userID, previousLocation);
            }

            // check into new spot
            await this.checkIntoSpot(userID, newLocation, hoursToCheckInFor);
        }
        catch(error)
        {
            return new DatabaseActionResult(
            false,
            `change check in spot failed for user ${userID}: ${error}`,
            );
        }
        return new DatabaseActionResult(true, `user changed checkin spots`)
        
    }

    // checks a user out from a pin
    async checkoutFromSpot(userID: string, location: LatLng) {
        console.log(`attempt checkoutFromSpot for user ${userID} at location ${coordinateToString(location)}`);
        try {
            const userDocRef = doc(this.database, "users", userID)
            const pinResult = await this.getPin(location);
            const pin = pinResult.data;

            if(pin == undefined) {
                throw new Error(pinResult.message)
            }

            const previousPinActivity = pin.activity;
            const previousPinCheckedInUserIds = previousPinActivity.checkedInUserIds;

            if(previousPinCheckedInUserIds.indexOf(userID) < 0) {
                throw new Error(`user was not checked into spot ${coordinateToString(location)}.`)
            }

            // update the pin's checkout info
            previousPinActivity.checkedInUserIds = previousPinCheckedInUserIds.filter(id => id !== userID);
            previousPinActivity.activeUsers--;
            const editPinActivityResult = await this.editPinActivity(location, previousPinActivity)

            if(!editPinActivityResult.succeeded) {
                throw new Error(editPinActivityResult.message)
            }

            // update the user's checkout info
            await updateDoc(userDocRef, {checkInSpot: null})
            console.log(`end of checkout`);
        }
        catch(error) {
            throw new Error(`checkout from spot failed for user ${userID} at location ${coordinateToString(location)}: ${error}`)
        }
    }

    // checks a user into a pin
    async checkIntoSpot(userID: string, location: LatLng, hoursToCheckinFor: number) {
        console.log(`attempt checkIntoSpot for user ${userID} at location ${coordinateToString(location)}`);
        try {
            const userDocRef = doc(this.database, "users", userID)
            const pinResult = await this.getPin(location);
            const pin = pinResult.data;

            const checkoutDate = new Date();
            console.log(`current date: ${checkoutDate}`);

            checkoutDate.setHours(checkoutDate.getHours() + hoursToCheckinFor);
            console.log(`checkout date: ${checkoutDate}`);
        
            if(pin == undefined) {
                throw new Error(pinResult.message)
            }

            const pinActivity = pin.activity;
            const pinCheckedInUserIds = pinActivity.checkedInUserIds;

            // update the pins checkin info
            pinCheckedInUserIds.push(userID);
            pinActivity.activeUsers++;
            pinActivity.totalUsers++;
            const editPinActivityResult = await this.editPinActivity(location, pinActivity);

            if(!editPinActivityResult.succeeded) {
                throw new Error(editPinActivityResult.message)
            }

            // update the user's checkin info
            await updateDoc(userDocRef, {checkInSpot: location, checkOutTime: checkoutDate});
        }
        catch(error) {
            throw new Error(`check into spot failed for user ${userID} at location ${coordinateToString(location)}: ${error}`)
        }
        // can remove after testing
        await this.getCheckInOfUser(userID);
    }

    async checkoutAllExpiredCheckins() {
        console.log(`attempt checkoutAllExpiredCheckins`);
        try {
            const usersResult = await this.getAllUsers();
            const users = usersResult.data;
            const currentDate = new Date();

            if(!users) {
                throw new Error(`${usersResult.message}`);
            }

            users.forEach(user => {
                if(user._checkInSpot && currentDate.getTime > user._checkOutTime.getTime) {
                    console.log(`checking out user: ${user._userID}, from spot: ${coordinateToString(user._checkInSpot)}, with checkout time: ${user._checkOutTime}.`);
                    this.checkoutFromSpot(user._userID, user._checkInSpot);
                }
            });
        } catch (error) {
            console.log(`could not checkout all expired checkins: ${error}`)
        }
    }

    // will try to checkout all expired checkins as often as specified by intervalInMinutes
    async checkoutAllExpiredCheckinsTask(intervalInMinutes: number) {
        setInterval(() => this.checkoutAllExpiredCheckins(), 1000 * 60 * intervalInMinutes)
    }

    // to test checkin
    async getCheckInOfUser(userID: string) {
        const userResult = await this.getUser(userID);
        const user = userResult.data;

        if(user) {
            const checkOutTime =  user._checkOutTime;
            console.log(`userID: ${user._userID}, checkout time: ${checkOutTime}`);
            if(user._checkInSpot) {
                 console.log(`checkinSpot: ${coordinateToString(user._checkInSpot)}`);
            } else {
                console.log(`checkInSpot: ${user._checkInSpot}`)
            }
        }
    }

    async deleteUser(userID: string) {
      const userDocRef = doc(this.database, "users", userID)
      try
      {
        const userDocSnap = await getDoc(userDocRef)
        if (!userDocSnap.exists())
        {
          throw new Error(`User with ID ${userID} doesn\'t exist`)
        }
        await deleteDoc(userDocRef)
      }
      catch(error)
      {
        console.log(`delete user failed: ${error}`)
      }
    }

    // Adds a pin to the database
    async addPin(pin: IPin): Promise<IDatabaseActionResult> {
        const pinRef = doc(this.database, "pins", coordinateToString(pin.coordinate));

        try {
            const pinDocSnap = await getDoc(pinRef);

            if (pinDocSnap.exists()) {
                throw new Error(`Pin already exists.`);
            }

            await setDoc(pinRef, pinConverter.toFirestore(pin));
        } catch (error) {
        return new DatabaseActionResult(
          false,
          `Failed: could not place pin at coordinate: ${coordinateToString(
            pin.coordinate
          )}. ${error}`
        );
        }

        return new DatabaseActionResult(
          true,
          `Succeeded: pin added at ${coordinateToString(pin.coordinate)}`
        );
    }

    // Edits pin details at coordinate
    async editPinDetails(coordinate: LatLng,details: PinDetails): Promise<IDatabaseActionResult> {
        try {
        const pinRef = doc(this.database, "pins", coordinateToString(coordinate));
        const pinDocSnap = await getDoc(pinRef);

        if (!pinDocSnap.exists()) {
            throw new Error(`Pin could not be found.`);
        }

        await updateDoc(pinRef, { details: pinDetailsConverter.toFirestore(details) });
        } catch (error) {
        return new DatabaseActionResult(
          false,
          `Failed: could not edit pin at coordinate ${coordinateToString(coordinate)}. ${error}`);
        }

        return new DatabaseActionResult(true, `Succeeded: pin edited at ${coordinateToString(coordinate)}`);
    }
  
  // Edits pin reviews at coordinate
  async editPinReviews(coordinate: LatLng, reviews: PinReview[]): Promise<IDatabaseActionResult> {
    try {
      const pinRef = doc(this.database, "pins", coordinateToString(coordinate));
      const pinDocSnap = await getDoc(pinRef);

      if (!pinDocSnap.exists()) {
        throw new Error(`Pin could not be found.`);
      }

      await updateDoc(pinRef, {
        reviews: pinReviewsConverter.toFirestore(reviews),
      });
    } catch (error) {
      return new DatabaseActionResult(
        false,
        `Failed: could not edit pin reviews at coordinate ${coordinateToString(
          coordinate
        )}. ${error}`
      );
    }

    return new DatabaseActionResult(
      true,
      `Succeeded: pin reviews edited at ${coordinateToString(coordinate)}`
    );
  }

  // Edits pin photos at coordinate
  async editPinPhotos(coordinate: LatLng, photos: PinPhoto[]): Promise<IDatabaseActionResult> {
    try {
      const pinRef = doc(this.database, "pins", coordinateToString(coordinate));
      const pinDocSnap = await getDoc(pinRef);

      if (!pinDocSnap.exists()) {
        throw new Error(`Pin could not be found.`);
      }

      await updateDoc(pinRef, {
        photos: pinPhotosConverter.toFirestore(photos),
      });
    } catch (error) {
      return new DatabaseActionResult(
        false,
        `Failed: could not edit pin photos at coordinate ${coordinateToString(
          coordinate
        )}. ${error}`
      );
    }

    return new DatabaseActionResult(
      true,
      `Succeeded: pin photos edited at ${coordinateToString(coordinate)}`
    );
  }

    // Edits pin activity at coordinate
    async editPinActivity(coordinate: LatLng, activity: PinActivity): Promise<IDatabaseActionResult> {
      try {
      const pinRef = doc(this.database, "pins", coordinateToString(coordinate));
      const pinDocSnap = await getDoc(pinRef);

      if (!pinDocSnap.exists()) {
          throw new Error(`Pin could not be found.`);
      }

      await updateDoc(pinRef, { activity: pinActivityConverter.toFirestore(activity) });
      } catch (error) {
      return new DatabaseActionResult(
        false,
        `Failed: could not edit pin activity at coordinate ${coordinateToString(coordinate)}. ${error}`);
      }

      return new DatabaseActionResult(true, `Succeeded: pin activity edited at ${coordinateToString(coordinate)}`);
  }

    // Deletes pin at given coordinate
    async deletePin(coordinate: LatLng): Promise<IDatabaseActionResult> {
        try {
            const pinRef = doc(this.database, "pins", coordinateToString(coordinate));
            const pinDocSnap = await getDoc(pinRef);

            if (!pinDocSnap.exists()) {
                throw new Error(`Pin could not be found.`);
            }
            await deleteDoc(pinRef);

        } catch (error) {

        return new DatabaseActionResult(false, `Failed: could not delete pin at coordinate ${coordinateToString(coordinate)}. ${error}`);

        }

        return new DatabaseActionResult(
        true,
        `Succeeded: pin deleted at: ${coordinateToString(coordinate)}`
        );
    }

    // Get the pin at a given coordinate
    async getPin(coordinate: LatLng): Promise<IPinActionResult<IPin>> {
        try {
        const pinRef = doc(this.database, "pins", coordinateToString(coordinate));

        const pinDocSnap = await getDoc(pinRef);

        if (!pinDocSnap.exists()) {
            throw new Error(`Pin could not be found`);
        }

        const pin = pinConverter.fromFirestore(pinDocSnap);

        return new PinActionResult<IPin>(
          new DatabaseActionResult(
            true,
            `Succeeded: pin retrieved from ${coordinateToString(coordinate)}`
          ),
          pin
        );
        } catch (error) {
        return new PinActionResult<IPin>(
            new DatabaseActionResult(
            false,
            `Failed: pin could not be retrieved from ${coordinateToString(coordinate)}. ${error}`
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

  // Get a coordinate[] of all pins from the database without retreiving details
  // Use getPin to get a specific pin
  async getAllPinCoordinates(): Promise<IPinActionResult<LatLng[]>> {
    try {
      const pinsCollection = collection(this.database, "pins");

      const pinSnapshot = await getDocs(pinsCollection);

      const pinsList = pinSnapshot.docs.map((doc) => doc.id);

      const pinCoordinatesList: LatLng[] = [];

      pinsList.forEach((pin) => {
        pinCoordinatesList.push(coordinateFromString(pin));
      });

      return new PinActionResult<LatLng[]>(
        new DatabaseActionResult(
          true,
          `Succeeded: pin coordinates retrieved.`
        ),
        pinCoordinatesList
      );
    } catch (error) {
      return new PinActionResult<LatLng[]>(
        new DatabaseActionResult(
          false,
          `Failed: pin coordinates could not be retrieved. ${error}`
        ),
        undefined
      );
    }
  }

// creates a listener for changes to the db
// should update the state of the store dependent on changes
// returns a subscriber that can be called to unsubcribe from changes
// https://firebase.google.com/docs/firestore/query-data/listen
 async monitorDatabaseChanges() {
    const pinsCollection = collection(this.database, "pins");
    const pinSnapshot = await getDocs(pinsCollection);
    const q = query(pinsCollection);

    return onSnapshot(pinsCollection, (snapshot) => {

        snapshot.docChanges().forEach((change) => {
            const pin = pinConverter.fromFirestore(change.doc); 
            console.log(`change: ${change}`);
            if(change.type === "added") {
                store.dispatch(addPin(pin));
            }
            else if(change.type === "modified") {
                store.dispatch(updatePin(pin));
            } else if(change.type === "removed") {
                store.dispatch(removePin(pin));
            }
        })
    })
  }

  async updatePinActivity() {
      
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

class UserActionResult<T> implements IUserActionResult<T> {
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

