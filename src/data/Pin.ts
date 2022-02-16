import { IPin, IPinDetails } from "./Interfaces"
import { GeoPoint } from "firebase/firestore/lite";

class Pin implements IPin {
    readonly location: GeoPoint;
    details: PinDetails;

    constructor (location: GeoPoint, details: PinDetails) {
        this.location = location;
        this.details = details;
    }

    toString (): string {
        return locationToString(this.location) + "\n" + this.details.toString();
    }
}

// class Location implements ILocation {
//     readonly latitude: number;
//     readonly longitude: number;

//     constructor (latitude: number, longitude: number) {
//         this.latitude = latitude;
//         this.longitude = longitude;
//     }

//     isEqual (other: ILocation): boolean {
//         return other.latitude == this.latitude && other.longitude == this.longitude;
//     }

//     toString (): string {
//         return this.latitude.toString() + "," + this.longitude.toString();
//     }
// }

class PinDetails implements IPinDetails {
    description: string;
    slacklineLength: number;
    slacklineType: string;

    constructor(description: string, slacklineLength: number, slacklineType: string) {
        this.description = description;
        this.slacklineLength = slacklineLength;
        this.slacklineType = slacklineType;
    }

    toString (): string{
        return "description: " + this.description + "\nslacklineLength: " + this.slacklineLength + "\nslacklineType: " + this.slacklineType;
    }
}

// to convert the location string from the database back into a location object
function locationFromString(locationString: string): GeoPoint {
    const splitLocation: string[] = locationString.split(",", 2);

    return new GeoPoint(Number(splitLocation[0]), Number(splitLocation[1]));
}

// converts GeoPoint to string
function locationToString(location: GeoPoint): string {
    return location.latitude.toString() + "," + location.longitude.toString();
}

export { Pin, PinDetails, locationFromString, locationToString }