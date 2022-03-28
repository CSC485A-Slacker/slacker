import { LatLng } from "react-native-maps";
import { IUser, IFriend, Status } from "./Interfaces";
import { coordinateToString } from "./Pin";

class User implements IUser
{
    _userID: string;
    _checkInSpot: LatLng | null;
    _checkOutTime: Date;
    _username: string;
    _friends: Friend[];

    constructor(userID: string, checkInSpot:LatLng | null, checkOutTime: Date, username: string, friends: Friend[])
    {
        this._userID = userID,
        this._checkInSpot = checkInSpot
        this._checkOutTime = checkOutTime
        this._username = username
        this._friends = friends
    }
}
  
  
class Friend implements IFriend {
  _friendID: string;
  _status: Status;

  constructor(friendID: string, status: Status) {
    this._friendID = friendID;
    this._status = status;
  }

  toString(): string {
    return "friendID: " + this._friendID + "\nstatus: " + this._status;
  }
}

function userIsCheckedIntoSpot(user: IUser, coordinate: LatLng): boolean {
        if(user._checkInSpot == null || coordinate == null) {
            return false;
        }
        return coordinateToString(user._checkInSpot).localeCompare(coordinateToString(coordinate)) == 0
    }

export {User, userIsCheckedIntoSpot, Friend}
