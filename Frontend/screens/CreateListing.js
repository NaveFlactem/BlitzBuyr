import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";

/** 
* @function
* @CreateListing
* @param {String} title - title variable, stores what the user inputs
* @param {String} description - description variable, stores what the user inputs
* @param {String} price - price variable, stores what the user inputs
* @param {Array} photos - photo variable, stores what the user inputs as an array
*/


const CreateListing = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [photos, setPhotos] = useState([]);
  /**
   * @function
   * @handleCreateListing - sends user inputted data to server and checks if it ran smoothly
   * @param {Object} formData - object that is sent to the server with user inputted values
   */
  const handleCreateListing = async () => {
    try {
      const formData = new FormData();

      photos.forEach((image, index) => {
        formData.append(`image_${index}`, image);
      });

      formData.append("price", price);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("username", "test");

      console.log("FormData:", formData);
      const response = await fetch("http://blitzbuyr.lol/api/createListing", {
        method: "POST",
        body: formData,
      });

      if (response.status <= 201) {
        const responseData = await response.json();
        console.log("Listing created successfully:", responseData);
        navigation.navigate("Home");
      } else {
        console.error("HTTP error! Status: ", response.status);
      }
    } catch (error) {
      console.error("Error creating listing:", error);
    }
  };
  /**
   * @function
   * @handleUploadPhoto - Uses ImagePicker to acess users photos and multiple of them. 
   */
  const handleUploadPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (result.cancelled) {
      return;
    }
  /**
   * @function
   * @selectedImages - processes images allowing them to be sent and displayed
   */
    const selectedImages = result.assets.map((image) => {
      let localUri = image.uri;
      let filename = localUri.split("/").pop();
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      let width = { width: image.width };
      let height = { height: image.height };

      return {
        uri: localUri,
        name: filename,
        type, // Adjust the name as needed
        width,
        height,
      };
    });

    // Now, you can set `selectedImages` in your state variable, which appears to be `setPhotos`.
    setPhotos(selectedImages);
  };
  /**
   * @function
   * @handleDeletePhoto - deletes photos that the user no longer wants to post
   */
  const handleDeletePhoto = (index) => {
    Alert.alert("Delete Photo", "Are you sure you want to delete this photo?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          const updatedPhotos = [...photos];
          updatedPhotos.splice(index, 1);
          setPhotos(updatedPhotos);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a Listing</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={(text) => setTitle(text)}
        returnKeyType="done" // This allows users to close the keyboard
      />
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Description"
        value={description}
        onChangeText={(text) => setDescription(text)}
        multiline={true}
        textAlignVertical="top" // Allows users to return to a new line
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={(text) => setPrice(text)}
        keyboardType="numeric"
        returnKeyType="done" // This allows users to close the numeric keyboard
      />
      <TouchableOpacity style={styles.uploadButton} onPress={handleUploadPhoto}>
        <Image
          source={require("../assets/ImageIcon.png")}
          style={styles.uploadIcon}
        />
      </TouchableOpacity>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {photos.map((photo, index) => (
          <View key={index}>
            <Image source={{ uri: photo.uri }} style={styles.uploadedPhoto} />
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeletePhoto(index)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity onPress={handleCreateListing}>
        <Text style={styles.createListingText}>Create Listing</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // Your existing styles here'

  container: {
    flex: 1,
    paddingTop: 50, //top of page
    padding: 30, //all around
    backgroundColor: "#D6447F",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    backgroundColor: "#F7A859",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  multilineInput: {
    height: 120,
  },
  uploadButton: {
    backgroundColor: "#F7A859",
    width: "100%",
    height: 250,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 1, // Add a border
    borderColor: "gray", // Border color
  },
  uploadIcon: {
    width: 100,
    height: 100,
  },

  uploadedPhoto: {
    width: 100,
    height: 100,
    margin: 10,
  },
  photoContainer: {
    position: "relative",
  },
  deleteButton: {
    position: "absolute",
    top: 3,
    right: 3,
    backgroundColor: "#ccc",
    padding: 3,
    borderRadius: 50,
    alignItems: "center",
  },
  createListingText: {
    alignSelf: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    backgroundColor: "#F7A859",
    bottom: "50%",
  },
});

export default CreateListing;
