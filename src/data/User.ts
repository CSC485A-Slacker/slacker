import { IUser } from "./Interfaces";

class User implements IUser
{
    _userID: string;
    _checkInSpot: number;

    constructor(userID: string, checkInSpot:number)
    {
        this._userID = userID,
        this._checkInSpot = checkInSpot
    }

}

export {User}