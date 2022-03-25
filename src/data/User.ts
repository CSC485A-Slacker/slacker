import { IUser } from "./Interfaces";

class User implements IUser
{
    _userID: string;
    _checkInSpot: number;
    _username: string;

    constructor(userID: string, checkInSpot:number, username: string)
    {
        this._userID = userID,
        this._checkInSpot = checkInSpot
        this._username = username
    }

}

export {User}