import { IFriend, IUser, Status } from "./Interfaces";

class User implements IUser {
  _userID: string;
  _checkInSpot: number;
  _username: string;
  _friends: Friend[];

  constructor(userID: string, checkInSpot: number, username: string, friends: Friend[]) {
    (this._userID = userID),
      (this._checkInSpot = checkInSpot),
      (this._username = username),
      (this._friends = friends);
  }
}

class Friend implements IFriend {
  _friendID: string;
  _username: string;
  _status: Status;

  constructor(friendID: string, username: string, status: Status) {
    this._friendID = friendID;
    this._username = username
    this._status = status;
  }

  toString(): string {
    return "friendID: " + this._friendID + "username: " + this._username + "\nstatus: " + this._status;
  }
}

export { User, Friend };
