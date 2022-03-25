import { getStorage } from "firebase/storage";
import { StyleSheet, View } from "react-native";
import { Image } from "react-native-elements";
import { PinPhoto } from "../data/Pin";

const IMAGE_FOLDER = "images/";

const storage = getStorage();

const PhotoItem = (prop: { photo: PinPhoto; key: string }) => {
  const photo = prop.photo;

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {photo.url && (
          <Image
            source={{ uri: photo.url }}
            style={{
              width: 150,
              height: 150,
              borderRadius: 10,
            }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
    marginRight: 10,
    flex: 1,
  },
  imageContainer: {
    flexDirection: "row",
    marginTop: 15,
  },
  text: {
    padding: 10,
  },
});

export default PhotoItem;
