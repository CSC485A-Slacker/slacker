import { IUser } from "./Interfaces";

class User implements IUser {
  _userID: string;
  _checkInSpot: number;
  _friends: string[];

  constructor(userID: string, checkInSpot: number, friends: string[]) {
    (this._userID = userID),
      (this._checkInSpot = checkInSpot),
      (this._friends = friends);
  }
}

export {User}