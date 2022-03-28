import {
  IPinDetails,
  IPin,
  IPinReview,
  IPinPhoto,
  IPinActivity,
  IFriend,
  IUser,
} from "./Interfaces";
import { QueryDocumentSnapshot } from "firebase/firestore/lite";
import { PinDetails, Pin, PinReview, PinPhoto, PinActivity } from "./Pin";
import { LatLng } from "react-native-maps";
import { Friend, User } from "./User";

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

const pinReviewsConverter = {
  toFirestore: (reviews: IPinReview[]) => {
    return arrayConverter.toFirestore(reviews, pinReviewConverter);
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    return arrayConverter.fromFirestore(snapshot, "reviews", pinReviewConverter);
  },
};

const arrayConverter = {
  toFirestore: (array: any[], itemConverter: any) => {
    const tempArray: any = [];

    array.forEach((item) => {
      tempArray.push(itemConverter.toFirestore(item));
    });

    return tempArray;
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, fieldPath: string, itemConverter: any) => {
    const array = snapshot.get(fieldPath);

    const tempArray: any[] = [];
    array.forEach((item: any) => {
      tempArray.push(itemConverter.fromFirestore(item));
    });

    return tempArray;
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
    return arrayConverter.toFirestore(photos, pinPhotoConverter);
  },
  fromFirestore: (snapshot: any) => {
    return arrayConverter.fromFirestore(snapshot, "photos", pinPhotoConverter);
  },
};

// const pinCheckoutTimesConverter = {
//   toFirestore: (checkoutTimes: Date[]) => {
//     return arrayConverter.toFirestore(checkoutTimes, pinPhotoConverter);
//   },
//   fromFirestore: (snapshot: any) => {
//     return arrayConverter.fromFirestore(snapshot, "photos", pinPhotoConverter);
//   },
// };

const pinActivityConverter = {
  toFirestore: (activity: IPinActivity) => {
    return {
      shareableSlackline: activity.shareableSlackline,
      activeUsers: activity.activeUsers,
      totalUsers: activity.totalUsers,
      checkedInUserIds: activity.checkedInUserIds
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    const activity = snapshot.get("activity");
    return new PinActivity(
      activity.shareableSlackline,
      activity.activeUsers,
      activity.totalUsers,
      activity.checkedInUserIds
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

const friendConverter = {
  toFirestore: (friend: IFriend) => {
    return {
      friendID: friend._friendID,
      status: friend._status,
    };
  },
  fromFirestore: (friend: any) => {
    return new Friend(friend.friendID, friend.status);
  },
};

const userFriendsConverter = {
  toFirestore: (friends: IFriend[]) => {
    const friendsArray: any = [];

    friends.forEach((friend) => {
      friendsArray.push(friendConverter.toFirestore(friend));
    });

    return friendsArray;
  },
  fromFirestore: (snapshot: any) => {
    const friends = snapshot.get("friends");

    const friendsArray: Friend[] = [];

    if (friends == undefined) {
      return []
    } else {
      friends.forEach((friend: any) => {
      friendsArray.push(friendConverter.fromFirestore(friend));
      });
    }
    

    return friendsArray;
  },
};

const userConverter = {
  toFirestore: (user: IUser) => {
    return {
      userID: user._userID,
      checkInSpot: user._checkInSpot,
      checkOutTime: user._checkOutTime,
      username: user._username,
      friends: user._friends,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    return new User(
      snapshot.get('userID'),
      snapshot.get('checkInSpot'),
      snapshot.get('checkOutTime').toDate(),
      snapshot.get("username"),
      userFriendsConverter.fromFirestore(snapshot) || []
    );
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
  userFriendsConverter,
};
