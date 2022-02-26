import {
  IPin,
  IPinDetails,
  IPinReview,
  IPinPhotos,
  IPinActivity,
} from "./Interfaces";
import { GeoPoint } from "firebase/firestore/lite";

class Pin implements IPin {
  key: number;
  readonly coordinate: GeoPoint;
  details: PinDetails;
  reviews: IPinReview[];
  photos: IPinPhotos[];
  activity: IPinActivity;

  constructor(
    key: number,
    coordinate: GeoPoint,
    details: PinDetails,
    reviews: PinReview[],
    photos: IPinPhotos[],
    activity: PinActivity
  ) {
    this.key = key;
    this.coordinate = coordinate;
    this.details = details;
    this.reviews = reviews;
    this.photos = photos;
    this.activity = activity;
  }

  toString(): string {
    return coordinateToString(this.coordinate) + "\n" + this.details.toString();
  }
}

// class coordinate implements ICoordinate {
//     readonly latitude: number;
//     readonly longitude: number;

//     constructor (latitude: number, longitude: number) {
//         this.latitude = latitude;
//         this.longitude = longitude;
//     }

//     isEqual (other: ICoordinate): boolean {
//         return other.latitude == this.latitude && other.longitude == this.longitude;
//     }

//     toString (): string {
//         return this.latitude.toString() + "," + this.longitude.toString();
//     }
// }

class PinDetails implements IPinDetails {
  title: string;
  description: string;
  slacklineLength: number;
  slacklineType: string;
  color: string;
  draggable: boolean;

  constructor(
    title: string,
    description: string,
    slacklineLength: number,
    slacklineType: string,
    color: string, 
    draggable: boolean,
  ) {
    this.title = title;
    this.description = description;
    this.slacklineLength = slacklineLength;
    this.slacklineType = slacklineType;
    this.color = color;
    this.draggable = draggable;
  }

  toString(): string {
    return (
      "title: " +
      this.title +
      "\ndescription: " +
      this.description +
      "\nslacklineLength: " +
      this.slacklineLength +
      "\nslacklineType: " +
      this.slacklineType +
      "\ncolor: " +
      this.color +
      "\ndraggable: " +
      this.draggable
    );
  }
}

class PinReview implements IPinReview {
  comment: string;
  rating: number;
  date: Date;

  constructor(comment: string, rating: number, date: Date) {
    this.comment = comment;
    this.rating = rating;
    this.date = date;
  }

  toString(): string {
    return (
      "comment: " +
      this.comment +
      "\nrating: " +
      this.rating +
      "\ndate: " +
      this.date
    );
  }
}

class PinPhotos implements IPinPhotos {
  url: string;
  date: Date;

  constructor(url: string, date: Date) {
    this.url = url;
    this.date = date;
  }

  toString(): string {
    return "url: " + this.url + "\ndate: " + this.date;
  }
}

class PinActivity implements IPinActivity {
  checkIn: boolean;
  activeUsers: number;
  totalUsers: number;

  constructor(checkIn: boolean, activeUsers: number, totalUsers: number) {
    this.checkIn = checkIn;
    this.activeUsers = activeUsers;
    this.totalUsers = totalUsers;
  }

  toString(): string {
    return (
      "checkIn: " +
      this.checkIn +
      "\nactiveUsers " +
      this.activeUsers +
      "\ntotalUsers: " +
      this.totalUsers
    );
  }
}

// to convert the coordinate string from the database back into a coordinate object
function coordinateFromString(coordinateString: string): GeoPoint {
  const splitCoordinate: string[] = coordinateString.split(",", 2);

  return new GeoPoint(Number(splitCoordinate[0]), Number(splitCoordinate[1]));
}

// converts GeoPoint to string
function coordinateToString(coordinate: GeoPoint): string {
  return coordinate.latitude.toString() + "," + coordinate.longitude.toString();
}

export {
  Pin,
  PinDetails,
  PinReview,
  PinPhotos,
  PinActivity,
  coordinateFromString,
  coordinateToString,
};
