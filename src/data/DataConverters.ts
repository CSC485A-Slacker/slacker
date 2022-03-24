import {
  IPinDetails,
  IPin,
  IPinReview,
  IPinPhoto,
  IPinActivity,
} from "./Interfaces";
import { QueryDocumentSnapshot } from "firebase/firestore/lite";
import { PinDetails, Pin, PinReview, PinPhoto, PinActivity } from "./Pin";
import { LatLng } from "react-native-maps";
import { User } from "./User";

// data converters to transform data to and from json objects for firestore use
const pinCoordinateConverter = {
  toFirestore: (coordinate: LatLng) => {
    return {
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    return snapshot.get("coordinate");
  },
};

const pinDetailsConverter = {
  toFirestore: (details: IPinDetails) => {
    return {
      title: details.title,
      slacklineLength: details.slacklineLength,
      slacklineType: details.slacklineType,
      description: details.description,
      color: details.color,
      draggable: details.draggable,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    const details = snapshot.get("details");
    return new PinDetails(
      details.title,
      details.description,
      details.slacklineLength,
      details.slacklineType,
      details.color,
      details.draggable
    );
  },
};

const pinReviewConverter = {
  toFirestore: (review: IPinReview) => {
    return {
      key: review.key,
      comment: review.comment,
      rating: review.rating,
      date: review.date,
    };
  },
  fromFirestore: (review: any) => {
    return new PinReview(
      review.key,
      review.comment,
      review.rating,
      review.date
    );
  },
};

// TODO: implement generic array converter
const pinReviewsConverter = {
  toFirestore: (reviews: IPinReview[]) => {
    const reviewsArray: any = [];

    reviews.forEach((review) => {
      reviewsArray.push(pinReviewConverter.toFirestore(review));
    });

    return reviewsArray;
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    const reviews = snapshot.get("reviews");

    const reviewsList: PinReview[] = [];
    reviews.forEach((review: any) => {
      reviewsList.push(pinReviewConverter.fromFirestore(review));
    });

    return reviewsList;
  },
};

const pinPhotoConverter = {
  toFirestore: (photo: IPinPhoto) => {
    return {
      url: photo.url,
      date: photo.date,
    };
  },
  fromFirestore: (photo: any) => {
    return new PinPhoto(photo.url, photo.date);
  },
};

const pinPhotosConverter = {
  toFirestore: (photos: IPinPhoto[]) => {
    const photosArray: any = [];

    photos.forEach((photo) => {
      photosArray.push(pinPhotoConverter.toFirestore(photo));
    });

    return photosArray;
  },
  fromFirestore: (snapshot: any) => {
    const photos = snapshot.get("photos");

    const photosList: PinPhoto[] = [];
    photos.forEach((photo: any) => {
      photosList.push(pinPhotoConverter.fromFirestore(photo));
    });

    return photosList;
  },
};

const pinActivityConverter = {
  toFirestore: (activity: IPinActivity) => {
    return {
      shareableSlackline: activity.shareableSlackline,
      activeUsers: activity.activeUsers,
      totalUsers: activity.totalUsers,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    const activity = snapshot.get("activity");
    return new PinActivity(
      activity.shareableSlackline,
      activity.activeUsers,
      activity.totalUsers
    );
  },
};

const pinConverter = {
  toFirestore: (pin: IPin) => {
    return {
      key: pin.key,
      coordinate: pinCoordinateConverter.toFirestore(pin.coordinate),
      details: pinDetailsConverter.toFirestore(pin.details),
      reviews: pinReviewsConverter.toFirestore(pin.reviews),
      photos: pinPhotosConverter.toFirestore(pin.photos),
      activity: pinActivityConverter.toFirestore(pin.activity),
      privateViewers: pin.privateViewers,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    return new Pin(
      snapshot.get("key"),
      pinCoordinateConverter.fromFirestore(snapshot),
      pinDetailsConverter.fromFirestore(snapshot),
      pinReviewsConverter.fromFirestore(snapshot),
      pinPhotosConverter.fromFirestore(snapshot),
      pinActivityConverter.fromFirestore(snapshot),
      snapshot.get("privateViewers") || []
    );
  },
};

const userConverter = {
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    return new User(snapshot.get("userID"), snapshot.get("checkInSpot"));
  },
};

export {
  pinConverter,
  pinCoordinateConverter,
  pinDetailsConverter,
  pinReviewsConverter,
  pinPhotosConverter,
  pinActivityConverter,
  userConverter,
};
