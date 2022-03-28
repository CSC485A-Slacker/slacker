import {
  IPin,
  IPinDetails,
  IPinReview,
  IPinPhoto,
  IPinActivity,
} from "./Interfaces";
import { LatLng } from "react-native-maps";

class Pin implements IPin {
  key: number;
  readonly coordinate: LatLng;
  details: PinDetails;
  reviews: IPinReview[];
  photos: IPinPhoto[];
  activity: IPinActivity;
  privateViewers: string[];

  constructor(
    key: number,
    coordinate: LatLng,
    details: PinDetails,
    reviews: PinReview[],
    photos: IPinPhoto[],
    activity: PinActivity,
    privateViewers: string[] = []
  ) {
    this.key = key;
    this.coordinate = coordinate;
    this.details = details;
    this.reviews = reviews;
    this.photos = photos;
    this.activity = activity;
    this.privateViewers = privateViewers;
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
    draggable: boolean
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
  key: string;
  comment: string;
  rating: number;
  date: string;

  constructor(key: string, comment: string, rating: number, date: string) {
    this.key = key;
    this.comment = comment;
    this.rating = rating;
    this.date = date;
  }

  toString(): string {
    return (
      "key: " +
      this.key +
      "\ncomment: " +
      this.comment +
      "\nrating: " +
      this.rating +
      "\ndate: " +
      this.date
    );
  }
}

class PinPhoto implements IPinPhoto {
  url: string;
  date: string;

  constructor(url: string, date: string) {
    this.url = url;
    this.date = date;
  }

  toString(): string {
    return "url: " + this.url + "\ndate: " + this.date;
  }
}

class PinActivity implements IPinActivity {
  shareableSlackline: boolean;
  activeUsers: number;
  totalUsers: number;
  checkedInUserIds: string[];

  constructor(shareableSlackline: boolean, activeUsers: number, totalUsers: number, checkedInUserIds: string[]) {
    this.shareableSlackline = shareableSlackline;
    this.activeUsers = activeUsers;
    this.totalUsers = totalUsers;
    this.checkedInUserIds = checkedInUserIds;
  }

  toString(): string {
    return (
      "shareableSlackline: " +
      this.shareableSlackline +
      "\nactiveUsers " +
      this.activeUsers +
      "\ntotalUsers: " +
      this.totalUsers
    );
  }
}

// to convert the coordinate string from the database back into a coordinate object
function coordinateFromString(coordinateString: string): LatLng {
  const splitCoordinate: string[] = coordinateString.split(",", 2);
  return {
    latitude: Number(splitCoordinate[0]),
    longitude: Number(splitCoordinate[1]),
  };
}

// converts LatLng to string
function coordinateToString(coordinate: LatLng): string {
  return coordinate.latitude.toString() + "," + coordinate.longitude.toString();
}

export {
  Pin,
  PinDetails,
  PinReview,
  PinPhoto,
  PinActivity,
  coordinateFromString,
  coordinateToString,
};
