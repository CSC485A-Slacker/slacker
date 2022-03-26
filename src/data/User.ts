import { LatLng } from "react-native-maps";
import { IUser } from "./Interfaces";
import { coordinateToString } from "./Pin";

class User implements IUser
{
    _userID: string;
    _checkInSpot: LatLng | null;
    _checkOutTime: Date;
    _username: string;

    constructor(userID: string, checkInSpot:LatLng | null, checkOutTime: Date, username: string)
    {
        this._userID = userID,
        this._checkInSpot = checkInSpot
        this._checkOutTime = checkOutTime
        this._username = username
    }
}

function userIsCheckedIntoSpot(user: IUser, coordinate: LatLng): boolean {
        if(user._checkInSpot == null || coordinate == null) {
            return false;
        }
        return coordinateToString(user._checkInSpot).localeCompare(coordinateToString(coordinate)) == 0
    }

export {User, userIsCheckedIntoSpot}