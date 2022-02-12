import { IPin, ILocation, IPinDetails } from "./Interfaces"

class Pin implements IPin {
    readonly location: Location;
    details: PinDetails;

    constructor (location: Location, details: PinDetails) {
        this.location = location;
        this.details = details;
    }

    toString (): string {
        return location.toString() + "\n" + this.details.toString();
    }
}

class Location implements ILocation {
    readonly latitude: number;
    readonly longitude: number;

    constructor (latitude: number, longitude: number) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    isEqual (other: ILocation): boolean {
        return other.latitude == this.latitude && other.longitude == this.longitude;
    }

    toString (): string {
        return this.latitude.toString() + "," + this.longitude.toString();

    }
}

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

export { Pin, Location, PinDetails }