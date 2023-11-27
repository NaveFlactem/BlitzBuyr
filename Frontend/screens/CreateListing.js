import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import React, { Component, memo } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DraggableGrid from 'react-native-draggable-grid';
import RNPickerSelect from 'react-native-picker-select';
import BouncePulse from '../components/visuals/BouncePulse.js';
import TopBar from '../components/visuals/TopBarGeneric.js';
import { serverIp } from '../config.js';
import Colors from '../constants/Colors';
import { currencies, tagOptions } from '../constants/ListingData.js';
import { screenHeight, screenWidth } from '../constants/ScreenDimensions.js';
import { getLocationWithRetry } from '../constants/Utilities';
import { getStoredUsername } from './auth/Authenticate.js';

const blurhash = 'L5H2EC=PM+yV0g-mq.wG9c010J}I';

const LoadingView = memo(() => (
  <View style={styles.loading}>
    <BouncePulse />
  </View>
));

const MinorLoadingView = memo(() => (
  <View style={styles.minorLoadingContainer}>
    <BouncePulse />
  </View>
));

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
      title: '',
      description: '',
      price: '',
      condition: '',
      transactionPreference: '',
      data: [],
      selectedTags: [],
      isScrollEnabled: true,
      isTitleInvalid: false,
      isDescriptionInvalid: false,
      isPriceInvalid: false,
      isImageInvalid: false,
      isConditionInvalid: false,
      isTransactionPreferenceInvalid: false,
      isTagInvalid: false,
      isMinorLoading: false,
      isLoading: false,
      selectedCurrency: 'USD',
      selectedCurrencySymbol: '$',
      showCurrencyOptions: false,
      tagsData: [...tagOptions],
      currencies: [...currencies],
    };
    this.titleInput = React.createRef();
    this.descriptionInput = React.createRef();
    this.priceInput = React.createRef();
    this.conditionInput = React.createRef();
    this.transactionPreferenceInput = React.createRef();
    this.imageInput = React.createRef();
    this.tagInput = React.createRef();
  }

  /**
   * @function
   * @destructor - resets state variables
   */
  destructor() {
    this.setState({
      title: '',
      description: '',
      price: '',
      condition: '',
      transactionPreference: '',
      data: [],
      selectedTags: [],
      selectedCurrency: 'USD',
      selectedCurrencySymbol: '$',
      tagsData: [...tagOptions],
      currencies: [...currencies],
      isTitleInvalid: false,
      isDescriptionInvalid: false,
      isPriceInvalid: false,
      isConditionInvalid: false,
      isTransactionPreferenceInvalid: false,
      isImageInvalid: false,
      isTagInvalid: false,
      isMinorLoading: false,
      isLoading: false,
    });
  }

  /**
   * @function
   * @checkValidListing - checks if the listing is valid
   * @stateUpdates - updates the states of the variables that check if the listing is valid
   * @returns Returns 0 if the listing is valid, -1 if the listing is invalid and 1 if no images are selected and 2 if too many images are selected and 3 if no tags are selected
   */
  checkValidListing = () => {
    let stateUpdates = {
      isPriceInvalid:
        this.state.price < 0 ||
        this.state.price.length > 7 ||
        this.state.price === '',
      isTitleInvalid:
        this.state.title.length === 0 || this.state.title.length > 25,
      isDescriptionInvalid:
        this.state.description.length === 0 ||
        this.state.description.length > 500,
      isConditionInvalid: ![
        'Excellent',
        'Good',
        'Fair',
        'Poor',
        'For Parts',
      ].includes(this.state.condition),
      isTransactionPreferenceInvalid: ![
        'Pickup',
        'Meetup',
        'Delivery',
        'No Preference',
      ].includes(this.state.transactionPreference),
      isImageInvalid:
        this.state.data.length === 0 || this.state.data.length > 9,
      isTagInvalid: this.state.selectedTags.length === 0,
    };

    this.setState(stateUpdates);

    if (Object.values(stateUpdates).includes(true)) {
      return -1; // Invalid form
    }
    if (this.state.data.length === 0) {
      return 1; // No images selected
    }
    if (this.state.data.length > 9) {
      return 2; // Too many images
    }
    if (this.state.selectedTags.length === 0) {
      return 3; // No tags selected
    }

    return 0; // Valid form
  };

  /**
   * @function
   * @handleCreateListing - sends user inputted data to server and checks if it ran smoothly
   * @param {Object} formData - object that is sent to the server with user inputted values
   */
  handleCreateListing = async () => {
    this.setState({ isLoading: true });

    const {
      title,
      description,
      price,
      selectedTags,
      data,
      condition,
      transactionPreference,
      selectedCurrency,
      selectedCurrencySymbol,
    } = this.state; // Destructuring state

    const returnCode = this.checkValidListing();
    if (returnCode !== 0) {
      this.setState({ isLoading: false });
      if (returnCode === -1) {
        Alert.alert('Error', 'Please correct the errors in the form.');
      } else if (returnCode === 1) {
        Alert.alert('No images selected', 'Please select at least one image.');
      } else if (returnCode === 2) {
        Alert.alert('Too many images', 'Please select no more than 9 images.');
      } else if (returnCode === 3) {
        Alert.alert('No tags selected', 'Please select at least one tag.');
      }
      return;
    }

    try {
      const formData = new FormData();

      data.forEach((image, index) => {
        // Append each image as a file
        formData.append(`image_${index}`, {
          uri: image.uri, // The URI of the image file
          name: `image_${index}.jpg`, // The desired file name
          type: 'image/jpeg', // The content type of the file
        });
      });

      let location = await getLocationWithRetry();
      const { latitude, longitude } = location.coords;

      // Convert location to a JSON string
      const locationString = JSON.stringify({ latitude, longitude });

      // Append the location to the formData
      formData.append('location', locationString);

      console.log('Location:', latitude, longitude);

      formData.append('price', price);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('tags', JSON.stringify(selectedTags));
      formData.append('username', getStoredUsername());
      formData.append('condition', condition);
      formData.append('transactionPreference', transactionPreference);
      formData.append('currency', selectedCurrency);
      formData.append('currencySymbol', selectedCurrencySymbol);

      console.log('Listing Data:', formData);
      const response = await fetch(`${serverIp}/api/createlisting`, {
        method: 'POST',
        body: formData,
        timeout: 10000,
      });

      if (response.status <= 201) {
        const responseData = await response.json();
        console.log('Listing created successfully:', responseData);
        this.destructor();
        this.props.navigation.navigate('Home', { refresh: true });
      } else {
        console.error('HTTP error! Status: ', response.status);
        Alert.alert('Error', 'Failed to create listing.');
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      this.setState({ isLoading: false });
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
    // Camera roll Permission
    const { status: libraryStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (libraryStatus !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
    }

    // Camera Permission
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    if (cameraStatus !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
    }
  };

  /**
   * @function
   * @handleImagePick - allows the user to select images from their library or take photos with their camera
   * @returns Returns the images that the user selected
   */
  handleImagePick = () => {
    Alert.alert(
      'Select Image',
      'Choose where to select images from:',
      [
        {
          text: 'Camera',
          onPress: () => this.handleCameraPick(),
        },
        {
          text: 'Photo Library',
          onPress: () => this.handleLibraryPick(),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  /**
   * @function
   * @handleCameraPick - allows the user to take photos with their camera
   * @returns Returns the photos that the user took
   * @description - allows the user to take photos with their camera
   */
  handleCameraPick = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      this.processImage(result);
    }
  };

  /**
   * @function
   * @handleLibraryPick - allows the user to select images from their library
   * @returns Returns the images that the user selected
   * @description - allows the user to select images from their library
   */
  handleLibraryPick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 9 - this.state.data.length,
    });

    if (!result.canceled) {
      this.processSelectedImages(result.assets);
    }
  };

  /**
   * @function
   * @processImage - processes the image that the user selected
   * @param {*} image
   * @returns Returns the image that the user selected
   * @description - processes the image that the user selected
   */
  processImage = async (image) => {
    // Process a single image
    const manipulatedImage = await this.manipulateImage(image.uri);
    if (manipulatedImage) {
      this.setState((prevState) => ({
        data: [...prevState.data, manipulatedImage],
      }));
    }
  };

  /**
   * @function
   * @processSelectedImages - processes the images that the user selected
   * @param {*} assets
   */
  processSelectedImages = async (assets) => {
    // Process multiple images
    const processedImages = await Promise.all(
      assets.map(async (asset) => this.manipulateImage(asset.uri))
    );
    this.setState((prevState) => ({
      data: [...prevState.data, ...processedImages.filter(Boolean)],
    }));
  };

  /**
   * @function
   * @manipulateImage - compresses the image that the user selected
   * @param {*} uri
   * @returns
   */
  manipulateImage = async (uri) => {
    try {
      const originalSize = await FileSystem.getInfoAsync(uri);
      const manipulateResult = await ImageManipulator.manipulateAsync(uri, [], {
        compress: 0.4,
        format: ImageManipulator.SaveFormat.JPEG,
      });
      const compressedSize = await FileSystem.getInfoAsync(
        manipulateResult.uri
      );
      const savedData = originalSize.size - compressedSize.size;

      console.log(
        `Original File Size for ${uri}:`,
        (originalSize.size / (1024 * 1024)).toFixed(2),
        'MB',
        `compressed to :`,
        (compressedSize.size / (1024 * 1024)).toFixed(2),
        'MB',
        `data saved: ${(savedData / (1024 * 1024)).toFixed(2)} MB`
      );

      return {
        name: manipulateResult.uri.split('/').pop(),
        key: String(Date.now()),
        uri: manipulateResult.uri,
      };
    } catch (error) {
      console.error('Image processing error:', error);
      return null;
    }
  };

  /**
   * @function
   * @handleDeletePhoto - deletes photos that the user no longer wants to post
   * @param {Number} index - index of the photo that the user wants to delete
   */
  handleDeletePhoto = (index) => {
    Alert.alert('Delete Photo', 'Are you sure you want to delete this photo?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => {
          this.setState((prevState) => ({
            data: prevState.data.filter((_, i) => i !== index),
          }));
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
  render_item(item, index) {
    return (
      <View style={styles.itemContainer} key={item.key}>
        {item.uri ? (
          <View style={styles.item}>
            <Image
              source={{ uri: item.uri }}
              style={styles.image}
              placeholder={blurhash}
              transition={200}
            />
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => this.handleDeletePhoto(index)}
            >
              <Text style={styles.deleteButtonText}>X</Text>
            </TouchableOpacity>
          </View>
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

  /**
   * @function
   * @handlePriceChange - handles when the user enters a price
   * @param {*} text
   * @description - handles when the user enters a price
   */
  handlePriceChange = (text) => {
    const regex = /^(\d{0,6}(\.\d{2})?)$/;

    if (regex.test(text) || text === '') {
      // If text matches the format (4 digits before decimal, 2 after) or is empty
      this.setState({ isPriceInvalid: false });
    } else {
      // If the text doesn't match the format
      this.setState({ isPriceInvalid: true });
    }
  };

  /**
   * @function
   * @handleTagPress - handles when the user presses a tag
   * @param {Number} index - index of the tag that the user pressed
   * @param {String} pressedTagName - name of the tag that the user pressed
   * @param {Boolean} isAlreadySelected - boolean that checks if the tag is already selected
   * @param {Array} newSelectedTags - array of the selected tags
   * @param {Array} newTagsData - array of the tags data
   * @param {Array} tagsData - array of the tags data
   * @param {Array} selectedTags - array of the selected tags
   * @description - handles when the user presses a tag
   * @returns Returns the tags that the user selected
   */
  handleTagPress = (index) => {
    this.setState((prevState) => {
      // Toggle the 'selected' state of the pressed tag
      const newTagsData = prevState.tagsData.map((tag, idx) => {
        if (idx === index) {
          return { ...tag, selected: !tag.selected };
        }
        return tag;
      });

      // Get the name of the tag that was pressed
      const pressedTagName = newTagsData[index].name;

      // Check if the tag is already in the selectedTags array
      const isAlreadySelected = prevState.selectedTags.includes(pressedTagName);

      let newSelectedTags;
      if (isAlreadySelected) {
        // If already selected, remove it from the array
        newSelectedTags = prevState.selectedTags.filter(
          (tagName) => tagName !== pressedTagName
        );
      } else {
        // If not selected, add it to the array
        newSelectedTags = [...prevState.selectedTags, pressedTagName];
      }

      return {
        tagsData: newTagsData, // Update tagsData with the new 'selected' state
        selectedTags: newSelectedTags, // Update selectedTags array
      };
    });
  };

  /**
   *
   * @param {*} tags
   * @param {*} itemsPerRow
   * @returns
   */
  groupTagsIntoRows = (tags, itemsPerRow) => {
    return tags.reduce((rows, tag, index) => {
      if (index % itemsPerRow === 0) rows.push([]);
      rows[rows.length - 1].push(tag);
      return rows;
    }, []);
  };

  handleCurrencySelection = (currencyName, currencySymbol) => {
    this.setState({
      selectedCurrency: currencyName,
      selectedCurrencySymbol: currencySymbol,
      showCurrencyOptions: false,
    });
  };

  renderCurrencyOptions = () => {
    return this.state.currencies.map((currency) => (
      <TouchableOpacity
        key={currency.name}
        onPress={() =>
          this.handleCurrencySelection(currency.name, currency.symbol)
        }
      >
        <Text style={styles.currencyOption}>
          {this.state.selectedCurrency === currency.name ? '✓ ' : ''}
          {`${currency.name} ${currency.symbol}`}
        </Text>
      </TouchableOpacity>
    ));
  };

  render() {
    const {
      isTitleInvalid,
      isDescriptionInvalid,
      isPriceInvalid,
      isConditionInvalid,
      isTransactionPreferenceInvalid,
      isImageInvalid,
      isTagInvalid,
      selectedCurrency,
    } = this.state;

    if (this.state.isLoading) {
      return (
        <SafeAreaView>
          <TopBar />
          <LoadingView />
        </SafeAreaView>
      );
    }

    if (this.state.isMinorLoading) {
      return (
        <SafeAreaView>
          <TopBar />
          <MinorLoadingView />
        </SafeAreaView>
      );
    }

    const rowsOfTags = this.groupTagsIntoRows(this.state.tagsData, 3);
    return (
      <View style={styles.wrapper}>
        <TopBar />

        <View style={styles.scrollfield}>
          <ScrollView scrollEnabled={this.state.isScrollEnabled}>
            {/* TOP BUTTON
            <TouchableOpacity onPress={this.handleCreateListing}>
              <View style={styles.createButton}>
                <Text style={styles.buttonText}>Create Listing</Text>
              </View>
            </TouchableOpacity>
            */}

            <View style={styles.rowContainer}>
              <View style={styles.rowContainer}>
                <Text style={styles.label}>Title</Text>
                {isTitleInvalid ? (
                  <View style={styles.rowContainer}>
                    <Text style={styles.asterisk}> *</Text>
                    <Text style={styles.errorMessage}>
                      {this.state.title == ''
                        ? 'Title is required'
                        : this.state.title.length > 25
                        ? 'Title too long'
                        : 'Must enter a valid title'}
                    </Text>
                  </View>
                ) : (
                  ''
                )}
              </View>
              <Text style={styles.characterCounter}>
                {this.state.title.length}/25
              </Text>
            </View>
            <TextInput
              ref={this.titleInput}
              style={[
                styles.input,
                isTitleInvalid ? { borderColor: 'red', borderWidth: 1 } : null,
              ]}
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
                        ? 'Description too long'
                        : this.state.description.length === 0
                        ? 'Description is required'
                        : 'Must enter a valid description'}
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
                (textAlign = 'left'),
                isDescriptionInvalid
                  ? { borderColor: 'red', borderWidth: 1 }
                  : null,
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
                    {this.state.price == ''
                      ? 'Price is required'
                      : this.state.price < 0
                      ? 'Invalid price'
                      : this.state.price.length >= 7
                      ? 'Price too large'
                      : 'Must enter a valid price'}
                  </Text>
                </View>
              ) : (
                ''
              )}
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 20,
              }}
            >
              <View style={{ ...styles.currencyButtonContainer }}>
                <TouchableOpacity
                  onPress={() => this.setState({ showCurrencyOptions: true })}
                >
                  <View style={styles.currencyButton}>
                    <Text style={styles.currencyButtonText}>
                      {this.state.selectedCurrency}{' '}
                      {this.state.selectedCurrencySymbol}
                    </Text>
                  </View>
                </TouchableOpacity>
                {this.state.showCurrencyOptions && (
                  <Modal
                    visible={this.state.showCurrencyOptions}
                    animationType="slide"
                  >
                    <ScrollView style = {styles.currencyScrollView} >
                    <View style={styles.modalContent}>
                      {this.renderCurrencyOptions()}
                    </View>
                    </ScrollView>
                    <View style={styles.closeButtonContainer}>
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({ showCurrencyOptions: false })
                      }
                      >
                          <Text style={styles.closeButton}>Close</Text>
                    </TouchableOpacity>
                    </View>
                  </Modal>
                )}
              </View>
              <TextInput
                ref={this.priceInput}
                style={[
                  styles.input,
                  { width: '94.5%', marginLeft: -101.5 },
                  isPriceInvalid
                    ? { borderColor: 'red', borderWidth: 1 }
                    : null,
                ]}
                value={this.state.price}
                onChangeText={(text) => {
                  this.setState({ price: text, isPriceInvalid: false });
                  this.handlePriceChange(text);
                }}
                keyboardType="numeric"
                returnKeyType="done"
                placeholder={`0.00`}
                maxLength={9}
              />
            </View>

            {/* TRANSACTION PREFERENCE*/}
            <View style={styles.rowContainer}>
              <Text style={{ ...styles.label, marginBottom: 0 }}>
                Transaction Preference
              </Text>
              {isTransactionPreferenceInvalid ? (
                <View style={styles.rowContainer}>
                  <Text style={styles.asterisk}> *</Text>
                  <Text style={styles.errorMessage}>
                    Must select a preference
                  </Text>
                </View>
              ) : (
                ''
              )}
            </View>
            <View style={styles.pickerStyle}>
              <RNPickerSelect
                selectedValue={this.state.transactionPreference}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({ transactionPreference: itemValue });
                  this.setState({ isTransactionPreferenceInvalid: false });
                }}
                items={[
                  { label: 'Pickup', value: 'Pickup' },
                  { label: 'Meetup', value: 'Meetup' },
                  { label: 'Delivery', value: 'Delivery' },
                  { label: 'No Preference', value: 'No Preference' },
                ]}
              />
            </View>

            {/* ITEM CONDITON */}
            <View style={styles.rowContainer}>
              <Text style={{ ...styles.label, marginTop: 10, marginBottom: 0 }}>
                Condition
              </Text>
              {isConditionInvalid ? (
                <View style={styles.rowContainer}>
                  <Text style={styles.asterisk}> *</Text>
                  <Text style={styles.errorMessage}>
                    Must select a condition
                  </Text>
                </View>
              ) : (
                ''
              )}
            </View>
            <View style={{ ...styles.pickerStyle }}>
              <RNPickerSelect
                selectedValue={this.state.condition}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({ condition: itemValue });
                  this.setState({ isConditionInvalid: false });
                }}
                items={[
                  { label: 'Excellent', value: 'Excellent' },
                  { label: 'Good', value: 'Good' },
                  { label: 'Fair', value: 'Fair' },
                  { label: 'Poor', value: 'Poor' },
                  { label: 'For Parts', value: 'For Parts' },
                ]}
              />
            </View>

            <TouchableOpacity
              onPress={this.handleImagePick}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Select Images</Text>
            </TouchableOpacity>
            {/* {
              isImageInvalid ? (
                <View style={[styles.rowContainer, {alignSelf: "center"}]}>
                  <Text style={styles.errorMessage}>
                    {this.state.data.length == 0
                      ? "Must select at least one image"
                      : this.state.data.length > 9
                      ? "Too many images selected"
                      : "Must select at least one image"}
                  </Text>
                </View>
              ) : (
                ""
              )
            } */}
            <View
              style={[
                styles.imageField,
                isImageInvalid ? { borderColor: 'red', borderWidth: 1 } : null,
              ]}
            >
              <View style={styles.innerField}>
                <DraggableGrid
                  numColumns={3}
                  renderItem={(item, index) => this.render_item(item, index)}
                  data={this.state.data}
                  onDragRelease={this.handleDragRelease}
                  onDragStart={this.handleDragStart}
                />
              </View>
            </View>

            {/* {
              isTagInvalid ? (
                <View style={[styles.rowContainer, {alignSelf: "center"}]}>
                  <Text style={styles.errorMessage}>
                    Must select at least one tag
                  </Text>
                </View>
              ) : (
                ""
              )
            } */}
            <ScrollView
              style={[
                styles.tagField,
                isTagInvalid ? { borderColor: 'red', borderWidth: 1 } : null,
              ]}
            >
              <View>
                {rowsOfTags.map((row, rowIndex) => (
                  <View key={rowIndex} style={styles.tagRowContainer}>
                    {row.map((tag, tagIndex) => (
                      <TouchableOpacity
                        key={tagIndex}
                        style={styles.tagContainer}
                        onPress={() => {
                          this.handleTagPress(tagIndex + rowIndex * 3);
                          if (this.state.selectedTags.length > 0) {
                            this.setState({ isTagInvalid: false });
                          }
                        }}
                      >
                        <View
                          style={[
                            styles.tagSelected,
                            { opacity: tag.selected ? 1 : 0.3 },
                          ]}
                        />
                        <View
                          style={[
                            styles.rhombus,
                            { opacity: tag.selected ? 0.15 : 0 },
                          ]}
                        />
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

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
    marginTop: 0,
    backgroundColor: Colors.BB_bone,
  },
  scrollfield: {
    top: 0.08 * screenHeight,
    height: 'auto',
    backgroundColor: Colors.BB_bone,
  },
  buttonText2: {
    marginTop: 10,
    color: Colors.black,
    fontSize: 22,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  minorLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  imageField: {
    alignSelf: 'center',
    width: '95%',
    height: 0.95 * screenWidth,
    backgroundColor: Colors.white,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: 'gray',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.9,
        shadowRadius: 2,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  deleteButton: {
    position: 'absolute',
    alignContent: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    top: 2,
    right: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    zIndex: 2,
    textAlign: 'center',
  },
  deleteButtonText: {
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
  },
  ///////////////
  tagField: {
    alignSelf: 'center',
    width: '95%',
    height: 0.4 * screenHeight,
    backgroundColor: Colors.white,
    borderRadius: 20,
    top: 30,
    marginBottom: 50,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  tagRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    marginTop: 10,
  },
  tagContainer: {
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 20,
    alignContent: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    height: 0.075 * screenHeight,
    width: 0.3 * screenWidth,
    ...Platform.select({
      ios: {
        shadowColor: 'gray',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.9,
        shadowRadius: 2,
      },
    }),
  },
  tagText: {
    color: Colors.white,
    fontSize: 18,
    alignSelf: 'center',
    fontWeight: 'bold',
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  rhombus: {
    alignSelf: 'center',
    position: 'absolute',
    width: 0.055 * screenHeight,
    aspectRatio: 1,
    backgroundColor: Colors.BB_darkPink,
    opacity: 0.15,
    transform: [{ rotate: '45deg' }],
  },
  tagSelected: {
    alignSelf: 'center',
    backgroundColor: Colors.BB_darkRedPurple,
    borderRadius: 20,
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
  ///////////////////////////
  innerField: {
    margin: 10,
    marginTop: 20,
    width: '95%',
    height: '95%',
  },
  itemContainer: {
    width: '33%',
    height: '33%',
    alignContent: 'center',
    justifyContent: 'center',
  },
  item: {
    marginTop: 10,
    width: 0.25 * screenWidth,
    height: 0.25 * screenWidth,
    borderRadius: 8,
    borderColor: Colors.BB_darkRedPurple,
    ...Platform.select({
      ios: {
        shadowColor: 'gray',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.9,
        shadowRadius: 2,
      },
      android: {
        elevation: 10,
      },
    }),
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  container: {
    flex: 1,
    paddingTop: 50, //top of page
    padding: 30, //all around
    backgroundColor: '#D6447F',
  },
  createButton: {
    marginTop: 20,
    alignSelf: 'center',
    width: screenWidth * 0.4,
    backgroundColor: Colors.BB_darkRedPurple,
    padding: 5,
    borderRadius: 10,
    fontWeight: 'bold',
    height: 36,
    width: 150,
    ...Platform.select({
      ios: {
        shadowColor: 'gray',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.9,
        shadowRadius: 2,
      },
      android: {
        elevation: 10,
      },
    }),
  },

  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
    marginTop: 20,
    left: 0.05 * screenWidth,
  },
  asterisk: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    left: 0.05 * screenWidth,
  },
  errorMessage: {
    fontSize: 12,
    color: 'red',
    marginLeft: 10,
    top: 0.008 * screenHeight,
    left: 0.05 * screenWidth,
  },

  input: {
    height: 40,
    borderColor: Colors.BB_black,
    borderRadius: 10,
    backgroundColor: 'white',
    opacity: 0.9,
    //marginBottom: 10,
    width: '90%',
    left: '5%',
    ...Platform.select({
      ios: {
        shadowColor: 'gray',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.9,
        shadowRadius: 2,
      },
      android: {
        elevation: 10,
      },
    }),
    textAlign: 'center',
    color: 'black',
  },
  multilineInput: {
    height: 120,
  },
  pickerStyle: {
    //bottomMargin: 10,
    height: 50,
    left: 0.05 * screenWidth,
    width: '45%',
    color: Colors.white,
    justifyContent: 'center',
  },
  button: {
    width: 150,
    height: 36,
    backgroundColor: Colors.BB_darkRedPurple,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: 20,
    borderColor: Colors.black,
    ...Platform.select({
      ios: {
        shadowColor: 'gray',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.9,
        shadowRadius: 2,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center',
  },

  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  characterCounter: {
    fontSize: 12,
    color: 'black',
    position: 'absolute',
    right: 0.05 * screenWidth,
  },
  loading: {
    height: screenHeight,
    width: screenWidth,
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  spacer: {
    height: 0.15 * screenHeight,
  },
  currencyButtonContainer: {
    alignItems: 'center',
    zIndex: 2,
    //marginTop: 20,
  },
  currencyButton: {
    width: 100,
    height: 40,
    backgroundColor: Colors.BB_darkRedPurple,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: 'black',
    //marginTop: -29.5
  },
  currencyButtonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.BB_bone,
  },
  currencyOption: {
    fontSize: 24,
    color: 'black',
    marginVertical: 10,
  },
  closeButtonContainer: {
    top: 0.8 * screenHeight,
    backgroundColor: Colors.BB_bone,
    alignSelf: 'center',
    zIndex: 2,
    marginTop: 20,
    borderRadius: 10,
    width: '25%',
    height: '20%',
  },
  closeButton: {
    position: 'absolute',
    fontSize: 24,
    color: 'black',
    borderRadius: 10,
    textAlign: 'center',
    alignSelf: 'center',
  },
  currencyScrollView: {
    position: 'absolute',
    backgroundColor: Colors.BB_bone,
    width: '100%',
    height: '100%',
    top: 0.1 * screenHeight,
  },
});
