import { serverIp } from "../config.js";
import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import DraggableGrid from "react-native-draggable-grid";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import { Image } from "expo-image";
import Colors from "../constants/Colors";
import TopBar from "../components/TopBar";
import * as SecureStore from "expo-secure-store";
import * as ImageManipulator from "expo-image-manipulator";

const blurhash = "L5H2EC=PM+yV0g-mq.wG9c010J}I";

const tagsData = [
  { name: "Furniture", selected: false },
  { name: "Electronics", selected: false },
  { name: "Clothing", selected: false },
  { name: "Books", selected: false },
  { name: "Appliances", selected: false },
  { name: "Sports", selected: false },
  { name: "Toys", selected: false },
  { name: "Tools", selected: false },
  { name: "Vehicles", selected: false },
  { name: "Service", selected: false},

  { name: "Other", selected: false },
];

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
      selectedTags: [],
      isScrollEnabled: true,
      isTitleInvalid: false,
      isDescriptionInvalid: false,
      isPriceInvalid: false,
      isImageInvalid: false,
      isTagInvalid: false,
      isLoading: false,
    };
    this.titleInput = React.createRef();
    this.descriptionInput = React.createRef();
    this.priceInput = React.createRef();
    this.imageInput = React.createRef();
    this.tagInput = React.createRef();
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
      selectedTags: [],
      isTitleInvalid: false,
      isDescriptionInvalid: false,
      isPriceInvalid: false,
    });
  }

  /**
   * @function
   * @checkValidListing - checks if the listing is valid
   * @returns Returns 0 if the listing is valid, 1 if no images are selected, 2 if too many images are selected, and -1 if the listing is invalid
   */
  checkValidListing = () => {
    let returnCode = 0;

    const { title, description, price, data } = this.state;

    if (this.state.title == "") {
      this.setState({ isTitleInvalid: true });
      this.titleInput.current.focus();
    }
    if (this.state.description == "") {
      this.setState({ isDescriptionInvalid: true });
      this.descriptionInput.current.focus();
    }
    if (this.state.price == "") {
      this.setState({ isPriceInvalid: true });
      this.priceInput.current.focus();
    }

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
        returnCode = -1;
      }
      if (this.state.data.length > 9) {
        this.setState({ isImageInvalid: true });
        returnCode = -1;
      }
      if (this.state.price < 0) {
        returnCode = -1;
      }
      if ((this.state.price = "")) {
        returnCode = -1;
      }
      if (this.state.title.length > 25) {
        returnCode = -1;
      }
      if ((this.state.title = "")) {
        returnCode = -1;
      }
      if (this.state.description.length > 500) {
        returnCode = -1;
      }
      if ((this.state.description = "")) {
        returnCode = -1;
      }

      if (
        this.state.isPriceInvalid ||
        this.state.isTitleInvalid ||
        this.state.isDescriptionInvalid ||
        this.state.isImageInvalid ||
        this.state.isTagInvalid
      ) {
        returnCode = -1;
      }
    }

    if (this.state.data.length == 0) {
      returnCode = 1;
    }
    if (this.state.data.length > 9) {
      returnCode = 2;
    }

    return returnCode;
  };

  /**
   * @function
   * @handleCreateListing - sends user inputted data to server and checks if it ran smoothly
   * @param {Object} formData - object that is sent to the server with user inputted values
   */
  handleCreateListing = async () => {
    this.setState({ isLoading: true });

    const { title, description, price, data } = this.state;

    try {
      const returnCode = this.checkValidListing();
      if (returnCode == -1) {
        return;
      } else if (returnCode == 1) {
        Alert.alert("No images selected.");
      } else if (returnCode == 2) {
        Alert.alert("Too many images selected.");
      } else if (returnCode == 0) {
        const formData = new FormData();

        data.forEach((image, index) => {
          // Append each image as a file
          formData.append(`image_${index}`, {
            uri: image.uri, // The URI of the image file
            name: `image_${index}.jpg`, // The desired file name
            type: "image/jpeg", // The content type of the file
          });
        });

        formData.append("price", price);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("username", await SecureStore.getItemAsync("username"));

        console.log("FormData:", formData);
        const response = await fetch(`${serverIp}/api/createlisting`, {
          method: "POST",
          body: formData,
        });

        if (response.status <= 201) {
          const responseData = await response.json();
          console.log("Listing created successfully:", responseData);
          this.destructor();
          this.props.navigation.navigate("Home", { refresh: true });
        } else {
          console.error("HTTP error! Status: ", response.status);
        }
      }
    } catch (error) {
      console.error("Error creating listing:", error);
    }
    this.setState({ isLoading: false });
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
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 9,
    });

    if (result.canceled) {
      return;
    }

    /**
     * @function
     * @selectedImages - processes images allowing them to be sent and displayed
     */
    const selectedImages = await Promise.all(
      result.assets.map(async function (image) {
        try {
          const manipulateResult = await ImageManipulator.manipulateAsync(
            image.uri,
            [],
            { compress: 0.4, format: ImageManipulator.SaveFormat.JPEG }
          );
          let localUri = manipulateResult.uri;
          let filename = localUri.split("/").pop();

          return {
            name: filename,
            key: String(Date.now()),
            uri: localUri,
          };
        } catch (error) {
          console.error("Image processing error:", error);
          return null;
        }
      })
    );

    // Filter out any potential null values (indicating errors)
    this.setState({ isLoading: true });
    const filteredImages = selectedImages.filter((image) => image !== null);

    this.setState((prevState) => ({
      isLoading: false,
      data: [...prevState.data, ...filteredImages],
    }));
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
          <Image
            source={{ uri: item.uri }}
            style={styles.image}
            placeholder={blurhash}
            transition={200}
          />
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

  handlePriceChange = (text) => {
    const regex = /^(\d{0,6}(\.\d{0,2})?)$/;

    if (regex.test(text) || text === "") {
      // If text matches the format (4 digits before decimal, 2 after) or is empty
      this.setState({ isPriceInvalid: false });
    } else {
      // If the text doesn't match the format
      this.setState({ isPriceInvalid: true });
    }
  };

  handleTagPress = (index) => {
    this.setState((prevState) => {
      const newTagsData = tagsData.map((tag, idx) => {
        if (idx === index) return { ...tag, selected: !tag.selected };
        return tag;
      });

      const newSelectedTags = newTagsData
        .filter((tag) => tag.selected)
        .map((tag) => tag.name);

      console.log("Selected tags:", newSelectedTags);
      return { selectedTags: newSelectedTags };
    });
  };

  groupTagsIntoRows = (tags, itemsPerRow) => {
    return tags.reduce((rows, tag, index) => {
      if (index % itemsPerRow === 0) rows.push([]);
      rows[rows.length - 1].push(tag);
      return rows;
    }, []);
  };

  render() {
    const {
      isTitleInvalid,
      isDescriptionInvalid,
      isPriceInvalid,
      isImageInvalid,
      isTagInvalid,
    } = this.state;

    const rowsOfTags = this.groupTagsIntoRows(tagsData, 3);
    return (
      <View style={styles.wrapper}>
        {this.state.isLoading && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={Colors.BB_darkRedPurple} />
            <Text>Loading...</Text>
          </View>
        )}
        <TopBar />

        <View style={styles.scrollfield}>
          <ScrollView scrollEnabled={this.state.isScrollEnabled}>
            <TouchableOpacity onPress={this.handleCreateListing}>
              <View style={styles.createButton}>
                <Text style={styles.buttonText}>Create Listing</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.rowContainer}>
              <View style={styles.rowContainer}>
                <Text style={styles.label}>Title</Text>
                {isTitleInvalid ? (
                  <View style={styles.rowContainer}>
                    <Text style={styles.asterisk}> *</Text>
                    <Text style={styles.errorMessage}>
                      {this.state.title == ""
                        ? "Title is required"
                        : this.state.title.length > 25
                        ? "Title too long"
                        : "Must enter a valid title"}
                    </Text>
                  </View>
                ) : (
                  ""
                )}
              </View>
              <Text style={styles.characterCounter}>
                {this.state.title.length}/25
              </Text>
            </View>
            <TextInput
              ref={this.titleInput}
              style={[styles.input, isTitleInvalid ? { borderColor: "red", borderWidth: 1 } : null]}
              value={this.state.title}
              onChangeText={(text) => {
                this.setState({ title: text, isTitleInvalid: false });
              }}
              returnKeyType="next"
              onSubmitEditing={() => this.descriptionInput.current.focus()}
              maxLength={25}
            />
            <View style={styles.rowContainer}>
              <View style={styles.rowContainer}>
                <Text style={styles.label}>Description</Text>
                {isDescriptionInvalid && (
                  <View style={styles.rowContainer}>
                    <Text style={styles.asterisk}> *</Text>
                    <Text style={styles.errorMessage}>
                      {this.state.description.length > 500
                        ? "Description too long"
                        : this.state.description.length === 0
                        ? "Description is required"
                        : "Must enter a valid description"}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.characterCounter}>
                {this.state.description.length}/500
              </Text>
            </View>
            <TextInput
              ref={this.descriptionInput}
              style={[
                styles.input,
                styles.multilineInput,
                (textAlign = "left"),
                isDescriptionInvalid ? { borderColor: "red", borderWidth: 1 } : null,
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
              maxLength={500}
            />

            <View style={styles.rowContainer}>
              <Text style={styles.label}>Price</Text>
              {isPriceInvalid ? (
                <View style={styles.rowContainer}>
                  <Text style={styles.asterisk}> *</Text>
                  <Text style={styles.errorMessage}>
                    {this.state.price == ""
                      ? "Price is required"
                      : this.state.price < 0
                      ? "Invalid price"
                      : this.state.price.length > 7
                      ? "Price too long"
                      : "Must enter a valid price"}
                  </Text>
                </View>
              ) : (
                ""
              )}
            </View>

            <TextInput
              ref={this.priceInput}
              style={[styles.input, isPriceInvalid ? { borderColor: "red", borderWidth: 1 } : null]}
              value={this.state.price}
              onChangeText={(text) => {
                this.setState({ price: text, isPriceInvalid: false });
                this.handlePriceChange(text);
              }}
              keyboardType="numeric"
              returnKeyType="done"
              placeholder="$000000.00"
              maxLength={9}
            />

            <TouchableOpacity
              onPress={this.handleImagePick}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Select Images</Text>
            </TouchableOpacity>
            <View style={[styles.imageField, isImageInvalid ? { borderColor: "red", borderWidth: 1 } : null]}>
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
            <ScrollView style={styles.tagFieldScroll}>
            <View style={[styles.tagField, isTagInvalid ? { borderColor: "red", borderWidth: 1 } : null]}>
              {rowsOfTags.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.tagRowContainer}>
                  {row.map((tag, tagIndex) => (
                    <TouchableOpacity
                      key={tagIndex}
                      style={styles.tagContainer}
                      onPress={() =>
                        this.handleTagPress(tagIndex + rowIndex * 3)
                      }
                    >
                      <View style={styles.tagSelected} />
                      <View style={styles.rhombus} />
                      <Text style={styles.tagText}>{tag.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
            </ScrollView>

            <TouchableOpacity onPress={this.handleCreateListing}>
              <View style={[styles.createButton, (top = 30), (bottom = 0)]}>
                <Text style={styles.buttonText}>Create Listing</Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.spacer} />
          </ScrollView>
        </View>
      </View>
    );
  }
}

export default CreateListing;

//////////////////////////////////////////////////////////////////////////////////////////
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: "100%",
    marginTop: 0,
    backgroundColor: Colors.BB_bone,
  },
  scrollfield: {
    top: 0.1 * screenHeight,
    height: "auto",
    backgroundColor: Colors.BB_bone,
  },
  buttonText2: {
    marginTop: 10,
    color: Colors.black,
    fontSize: 22,
    alignSelf: "center",
    fontWeight: "bold",
  },
  imageField: {
    alignSelf: "center",
    width: "95%",
    height: 400,
    backgroundColor: Colors.white,
    borderRadius: 20,
    shadowColor: "gray",
    shadowOpacity: 0.9,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 3,
  },

  tagField: {
    alignSelf: "center",
    width: "95%",
    height: 600,
    backgroundColor: Colors.white,
    borderRadius: 20,
    shadowColor: "gray",
    shadowOpacity: 0.9,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 3,
    top: 30,
    marginBottom: 50,
  },
  tagRowContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
    marginTop: 10,
  },
  tagContainer: {
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 20,
    alignContent: "center",
    justifyContent: "center",
    textAlign: "center",
    height: 0.08 * screenHeight,
    width: 0.3 * screenWidth,
    shadowColor: "gray",
    shadowOpacity: 0.9,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 3,
  },
  tagText: {
    color: Colors.white,
    fontSize: 18,
    alignSelf: "center",
    fontWeight: "bold",
  },
  rhombus: {
    alignSelf: "center",
    position: "absolute",
    width: "40%",
    aspectRatio: 1,
    backgroundColor: Colors.BB_darkPink,
    opacity: 0.15,
    transform: [{ rotate: "45deg" }],
  },
  tagSelected: {
    alignSelf: "center",
    backgroundColor: Colors.BB_darkRedPurple,
    borderRadius: 20,
    height: "100%",
    width: "100%",
    position: "absolute",
  },

  innerField: {
    margin: 10,
    marginTop: 20,
    width: "95%",
    height: "95%",
  },
  item: {
    marginTop: 10,
    width: 100,
    height: 100,
    borderRadius: 8,
    borderColor: Colors.BB_darkRedPurple,
    shadowColor: "gray",
    shadowOpacity: 0.9,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 3,
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
    marginTop: 20,
    alignSelf: "center",
    width: screenWidth * 0.4,
    backgroundColor: Colors.BB_darkRedPurple,
    padding: 5,
    borderRadius: 10,
    fontWeight: "bold",
    height: 36,
    width: 150,
    shadowColor: "gray",
    shadowOpacity: 0.9,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 3,
  },

  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "black",
    marginTop: 20,
    left: 0.05 * screenWidth,
  },
  asterisk: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
    left: 0.05 * screenWidth,
  },
  errorMessage: {
    fontSize: 12,
    color: "red",
    marginLeft: 10,
    top: 0.008 * screenHeight,
    left: 0.05 * screenWidth,
  },

  input: {
    height: 40,
    borderColor: Colors.BB_black,
    borderRadius: 10,
    backgroundColor: "white",
    opacity: 0.9,
    marginBottom: 10,
    width: "90%",
    left: "5%",
    shadowColor: "gray",
    shadowOpacity: 0.9,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 3,
    textAlign: "center",
    color: "black",
  },
  multilineInput: {
    height: 120,
  },

  button: {
    width: 150,
    height: 36,
    backgroundColor: Colors.BB_darkRedPurple,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    alignSelf: "center",
    borderRadius: 10,
    marginTop: 20,
    borderColor: Colors.black,
    shadowColor: "gray",
    shadowOpacity: 0.9,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 3,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    alignSelf: "center",
  },

  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  characterCounter: {
    fontSize: 12,
    color: "black",
    position: "absolute",
    right: 0.05 * screenWidth,
  },
  loading: {
    height: screenHeight,
    width: screenWidth,
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  spacer: {
    height: 400,
  },
});
