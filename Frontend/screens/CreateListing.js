import { serverIp } from "../config.js";
import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  Alert,
} from "react-native";
import DraggableGrid from "react-native-draggable-grid";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import { Camera } from "expo-camera"; // Import Camera from Expo
import Colors from "../constants/Colors";
import BottomBar from "../components/BottomBar";
import TopBar from "../components/TopBar";

/**
 * @class
 * @classdesc - CreateListing is a screen that allows users to create a listing
 * @extends Component
 * @returns Returns a CreateListing screen
 */
class CreateListing extends Component {
  /**
   * @param {*} props
   * @constructor
   * @description - CreateListing constructor
   * @initialize state variables
   * @initialize refs
   */
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      price: "",
      data: [],
      isScrollEnabled: true,
      isTitleInvalid: false,
      isDescriptionInvalid: false,
      isPriceInvalid: false,
      isImageInvalid: false,
      isTagInvalid: false,
    };
    this.titleInput = React.createRef();
    this.descriptionInput = React.createRef();
    this.priceInput = React.createRef();
  }

  /**
   * @function
   * @destructor - resets state variables
   */
  destructor() {
    this.setState({
      title: "",
      description: "",
      price: "",
      data: [],
      isTitleInvalid: false,
      isDescriptionInvalid: false,
      isPriceInvalid: false,
    });
  }

  /**
   * @function
   * @handleCreateListing - sends user inputted data to server and checks if it ran smoothly
   * @param {Object} formData - object that is sent to the server with user inputted values
   */
  handleCreateListing = async () => {
    const { title, description, price } = this.state;

    if (!title || !description || !price) {
      if (!title) {
        this.setState({ isTitleInvalid: true });
        this.titleInput.current.focus();
      } else {
        this.setState({ isTitleInvalid: false });
      }

      if (!description) {
        this.setState({ isDescriptionInvalid: true });
        this.descriptionInput.current.focus();
      } else {
        this.setState({ isDescriptionInvalid: false });
      }

      if (!price) {
        this.setState({ isPriceInvalid: true });
        this.priceInput.current.focus();
      } else {
        this.setState({ isPriceInvalid: false });
      }
      
      if (this.state.data.length == 0) {
        this.setState({ isImageInvalid: true });
        return Alert.alert("Please select at least one image.");
      }

      return;
    }

    try {
      const formData = new FormData();

      this.state.data.forEach((image, index) => {
        formData.append(`image_${index}`, image);
      });

      formData.append("price", this.price);
      formData.append("title", this.title);
      formData.append("description", this.description);
      formData.append("username", "test");

      console.log("FormData:", formData);
      const response = await fetch(`${serverIp}/api/createListing`, {
        method: "POST",
        body: formData,
      });

      if (response.status <= 201) {
        const responseData = await response.json();
        console.log("Listing created successfully:", responseData);
        this.destructor();
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
   * @componentDidMount - calls getPermissionAsync() when component mounts
   */
  componentDidMount() {
    this.getPermissionAsync();
  }

  /**
   * @function
   * @getPermissionAsync - asks for permission to access camera roll
   */
  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  /**
   * @function
   * @handleImagePick - allows user to select images from their camera roll
   * @param {Object} result - object that contains the image(s) that the user selected
   */
  handleImagePick = async () => {
    if (this.state.data.length >= 9) {
      return Alert.alert("You can only select up to 9 images.");
    }
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.cancelled) {
      const newImageData = result.assets.map((asset) => ({
        name: "New Image", // Customize the name as needed
        key: String(Date.now()), // Generate a unique key
        uri: asset.uri,
      }));

      this.setState((prevState) => ({
        data: [...prevState.data, ...newImageData],
      }));
    }
  };

  /**
   * @function
   * @handleCameraCapture - allows user to take a picture with their camera
   */
  handleCameraCapture = async () => {
    if (this.camera) {
      let result = await this.camera.takePictureAsync({ quality: 1 });
      if (result.uri) {
        const newImageData = {
          name: "New Image", // Customize the name as needed
          key: String(Date.now()), // Generate a unique key
          uri: result.uri,
        };

        this.setState((prevState) => ({
          data: [...prevState.data, newImageData],
        }));
      }
    }
  };

  /**
   * @function
   * @handleDeletePhoto - deletes photos that the user no longer wants to post
   * @param {Number} index - index of the photo that the user wants to delete
   */
  handleDeletePhoto = (index) => {
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

  /**
   *
   * @param {*} item
   * @description - renders the images that the user selected
   * @returns Returns the images that the user selected
   */
  render_item(item) {
    return (
      <View style={styles.item} key={item.key}>
        {item.uri ? (
          <Image source={{ uri: item.uri }} style={styles.image} />
        ) : (
          <Text style={styles.item_text}>{item.name}</Text>
        )}
      </View>
    );
  }

  /**
   * @function
   * @handleDragStart - disables scrolling when the user is dragging an image
   */
  handleDragStart = () => {
    // When a drag starts, disable scrolling
    this.setState({ isScrollEnabled: false });
  };

  /**
   * @function
   * @handleDragRelease - enables scrolling when the user is done dragging an image
   */
  handleDragRelease = (data) => {
    // When the drag is released, enable scrolling
    this.setState({ data, isScrollEnabled: true });
  };

  render() {
    const { isTitleInvalid, isDescriptionInvalid, isPriceInvalid } = this.state;

    return (
      <View style={styles.wrapper}>
        <TopBar />

        <View style={styles.scrollfield}>
          <ScrollView scrollEnabled={this.state.isScrollEnabled}>
            <TouchableOpacity onPress={this.handleCreateListing}>
              <View style={styles.createButton}>
                <Text style={styles.buttonText}>Create Listing</Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.label}>Title{isTitleInvalid ? " *" : ""}</Text>
            <TextInput
              ref={this.titleInput}
              style={[styles.input, this.state.isTitleInvalid ? (borderColor="red", borderWidth=3) : null]}
              value={this.state.title}
              onChangeText={(text) => {
                this.setState({ title: text, isTitleInvalid: false });
              }}
              returnKeyType="next"
              onSubmitEditing={() => this.descriptionInput.current.focus()}
            />

            <Text style={styles.label}>
              Description{isDescriptionInvalid ? " *" : ""}
            </Text>
            <TextInput
              ref={this.descriptionInput}
              style={[
                styles.input,
                styles.multilineInput,
                this.state.isDescriptionInvalid ? (borderColor="red", borderWidth=3) : null,
              ]}
              value={this.state.description}
              onChangeText={(text) => {
                this.setState({
                  description: text,
                  isDescriptionInvalid: false,
                });
              }}
              multiline={true}
              textAlignVertical="top"
              returnKeyType="next"
              onSubmitEditing={() => this.priceInput.current.focus()}
            />

            <Text style={styles.label}>Price{isPriceInvalid ? " *" : ""}</Text>
            <TextInput
              ref={this.priceInput}
              style={[
                styles.input,
                this.state.isPriceInvalid ? (borderColor="red", borderWidth=3) : null,
              ]}
              value={this.state.price}
              onChangeText={(text) => {
                this.setState({ price: text, isPriceInvalid: false });
              }}
              keyboardType="numeric"
              returnKeyType="done"
            />

            <View style={styles.cameraContainer}>
              <Camera
                style={styles.cameraPreview}
                ref={(ref) => (this.camera = ref)}
              />
            </View>
            <TouchableOpacity
              onPress={this.handleImagePick}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Select Images</Text>
            </TouchableOpacity>
            <View style={styles.imageField}>
              <View style={styles.innerField}>
                <DraggableGrid
                  numColumns={3}
                  renderItem={this.render_item}
                  data={this.state.data}
                  onDragRelease={this.handleDragRelease}
                  onDragStart={this.handleDragStart}
                />
              </View>
            </View>

              <View style={styles.tagField}>

              </View>
            
            <TouchableOpacity onPress={this.handleCreateListing}>
              <View style={[styles.createButton, top = 30, bottom=0]}>
                <Text style={styles.buttonText}>Create Listing</Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.spacer} />
          </ScrollView>
        </View>

        <BottomBar />

      </View>
    );
  }
}

export default CreateListing;

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: "100%",
    marginTop: 0,
    backgroundColor: Colors.BB_darkOrange,
  },
  scrollfield: {
    top: 0.1 * screenHeight,
    height: "auto",
    backgroundColor: Colors.BB_darkOrange,
  },
  imageField: {
    alignSelf: "center",
    width: "95%",
    height: 400,
    backgroundColor: Colors.BB_darkRedPurple,
    borderRadius: 20,
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 3,
    elevation: 5,
    margin: 0,
  },
  tagField: {
    alignSelf: "center",
    width: "95%",
    height: 600,
    backgroundColor: Colors.BB_darkRedPurple,
    borderRadius: 20,
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 3,
    top: 30,
  },
  innerField: {
    margin: 10,
    marginTop: 20,
    width: "95%",
    height: "95%",
  },
  item: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderColor: Colors.BB_darkOrange,
    borderWidth: 2,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  item_text: {
    fontSize: 40,
    color: "#FFFFFF",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  container: {
    flex: 1,
    paddingTop: 50, //top of page
    padding: 30, //all around
    backgroundColor: "#D6447F",
  },
  createButton: {
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
    backgroundColor: Colors.BB_yellow,
    borderRadius: 20,
    shadowColor: "black",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  input: {
    height: 40,
    borderColor: Colors.BB_darkPink,
    borderRadius: 10,
    backgroundColor: Colors.BB_darkRedPurple,
    opacity: 0.9,
    marginBottom: 10,
    width: "90%",
    left: "5%",
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 3,
    textAlign: "center",
  },
  multilineInput: {
    height: 120,
  },
  button: {
    width: 150,
    height: 50,
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    alignSelf: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    alignSelf: "center",
  },
  errorMessage: {
    fontSize: 12,
    color: "red",
    marginLeft: 10,
  },
  spacer: {
    height: 400,
  },
});
