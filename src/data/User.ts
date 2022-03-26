import { LatLng } from "react-native-maps";
import { IUser } from "./Interfaces";

class User implements IUser
{
    _userID: string;
    _checkInSpot: LatLng | null;
    _checkOutTime: Date;

    constructor(userID: string, checkInSpot:LatLng, checkOutTime: Date)
    {
        this._userID = userID,
        this._checkInSpot = checkInSpot
        this._checkOutTime = checkOutTime
    }

}

export {User}