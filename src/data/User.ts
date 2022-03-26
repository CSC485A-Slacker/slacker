import { LatLng } from "react-native-maps";
import { IUser } from "./Interfaces";

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

export {User}