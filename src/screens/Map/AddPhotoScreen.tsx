import { useState } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";
import { Text, Image, Button, Overlay } from "react-native-elements";
import { PinPhoto } from "../../data/Pin";
import { Database } from "../../data/Database";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import { defaultColor, greyColor } from "../../style/styles";
import { useToast } from "react-native-toast-notifications";

const IMAGE_FOLDER = "images/";

const database = new Database();
const storage = getStorage();

export const AddPhotoScreen = ({ route, navigation }: any) => {
  const { pin } = route.params;
  const [photoUri, setPhotoUri] = useState("null");
  const [photoRef, setPhotoRef] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const pickPhoto = async () => {
    // No permissions request is necessary for launching the image library
    let pickedImage = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0,
    });
    if (!pickedImage.cancelled) {
      setSubmitButtonDisabled(false);
      setPhotoUri(pickedImage.uri);
      const pinRef = pin.key.toString() + "-" + new Date().toJSON();
      const pinFolder = pin.key.toString() + "/";
      setPhotoRef(pinFolder + pinRef);
    }
  };

  // Created using this: https://firebase.google.com/docs/storage/web/upload-files#full_example
  const onSubmitPress = async () => {
    try {
      const blob: any = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", photoUri, true);
        xhr.send(null);
      });
      const storageRef = ref(storage, IMAGE_FOLDER + photoRef);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setLoading(true);
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.log(`Error uploading photo to firebase: ${error}`);
          alert("Photo upload failed, sorry :( try again later");
          navigation.navigate({
            name: "Map",
          });
        },
        () => {
          blob.close();
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            updatePinPhoto(downloadURL);
          });
        }
      );
    } catch (error) {
      console.log(`Error uploading photo to firebase: ${error}`);
      alert("Photo upload failed, sorry :( try again later");
      navigation.navigate({
        name: "Map",
      });
    }
    setLoading(false);
  };

  const updatePinPhoto = async (pinUrl: string) => {
    try {
      const date = new Date().toJSON();
      pin.photos.push(new PinPhoto(pinUrl, date));
      navigation.navigate({
        name: "Map",
      });
      const resp = await database.editPinPhotos(pin.coordinate, pin.photos);
      if (resp.succeeded) {
        toast.show("Added a photo successfully!", {
          type: "success",
        });
      }
    } catch (error) {
      console.log(`Error updating pin when trying to save new photo: ${error}`);
      alert("Photo upload failed, sorry :( try again later");
      navigation.navigate({
        name: "Map",
      });
    }
  };

  return (
    <View style={styles.view}>
      <View style={styles.container}>
        <Text style={styles.title} h3>
          Photo of {pin.details.title}
        </Text>
        <Text style={styles.subTitle}>
          {pin.details.slacklineType} - {pin.details.slacklineLength}m
        </Text>
      </View>
      <View>
        <View style={styles.container}>
          {photoUri && (
            <Image
              source={{ uri: photoUri }}
              style={{ width: 200, height: 200 }}
            />
          )}
          <Text style={styles.subText}>Your image will be shown here</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <View style={styles.buttonContainer}>
            <Button
              title="Select Photo"
              buttonStyle={{
                backgroundColor: defaultColor,
                borderWidth: 1,
                borderColor: "white",
                borderRadius: 30,
                padding: 10,
                width: 150,
              }}
              containerStyle={{
                margin: 15,
              }}
              icon={{ name: "my-library-add", size: 20, color: "white" }}
              titleStyle={{ fontSize: 16 }}
              onPress={pickPhoto}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Submit"
              buttonStyle={{
                backgroundColor: defaultColor,
                borderWidth: 1,
                borderColor: "white",
                borderRadius: 30,
                padding: 10,
                width: 150,
              }}
              containerStyle={{
                margin: 15,
              }}
              icon={{
                name: "angle-double-right",
                type: "font-awesome",
                size: 20,
                color: "white",
              }}
              titleStyle={{ fontSize: 16 }}
              onPress={onSubmitPress}
              disabled={submitButtonDisabled}
            />
          </View>
        </View>
        <View style={styles.container}>
          <Overlay
            isVisible={loading}
            overlayStyle={{
              borderRadius: 10,
            }}
          >
            <View style={styles.container}>
              <Text style={styles.loadingTitle}>Uploading Image</Text>
              <Text style={styles.loadingText}>Please hang tight</Text>
              <ActivityIndicator size="large" color={defaultColor} />
            </View>
          </Overlay>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    margin: 10,
    flex: 1,
    justifyContent: "flex-start",
  },
  container: {
    alignItems: "center",
  },
  title: {
    padding: 40,
    paddingBottom: 10,
    color: defaultColor,
    textAlign: "center"
  },
  subTitle: {
    color: defaultColor,
    paddingBottom: 20,
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  buttonContainer: {
    flex: 1,
  },
  subText: {
    alignItems: "center",
    padding: 10,
    fontSize: 12,
    color: greyColor,
  },
  loadingTitle: {
    padding: 40,
    paddingBottom: 10,
    color: defaultColor,
    fontSize: 18,
  },
  loadingText: {
    alignItems: "center",
    marginBottom: 20,
    fontSize: 12,
    color: greyColor,
  },
});
