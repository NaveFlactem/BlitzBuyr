/**
 * @namespace CreateListing
 * @memberof Screens
 */
import { serverIp } from '../config';
import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useEffect, useRef, memo } from 'react';
import {
  Alert,
  Modal,
  Platform,
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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BouncePulse from '../components/visuals/BouncePulse.js';
import TopBar from '../components/visuals/TopBarGeneric.js';
import Colors from '../constants/Colors';
import { currencies, tagOptions } from '../constants/ListingData.js';
import { screenHeight, screenWidth } from '../constants/ScreenDimensions.js';
import { getLocationWithRetry } from '../constants/Utilities';
import { handleListingCreation } from '../network/Service.js';
import { getStoredUsername } from './auth/Authenticate.js';
import { useThemeContext } from '../components/visuals/ThemeProvider';
import { getThemedStyles } from '../constants/Styles';
//test commit
/**
 * @constant {string} blurhash - blurhash for the loading image in draggable grid
 * @memberof Screens.CreateListing
 */

const blurhash = 'L5H2EC=PM+yV0g-mq.wG9c010J}I';

/**
 * @function
 * @description - renders the loading animation for the create listing screen on full screen refresh after the user creates a listing
 * @param {Object} styles - object that holds the styles for the create listing screen
 * @returns {JSX.Element} - Loading animation
 * @memberof Screens.CreateListing
 */
const LoadingView = memo(({ styles }) => (
  <View style={styles.loading}>
    <BouncePulse />
  </View>
));

/**
 * @function
 * @description - renders the loading animation for the create listing screen on minor refreshes, for example when the user selects an image
 * @param {Object} styles - object that holds the styles for the create listing screen
 * @returns {JSX.Element} - Loading animation
 * @memberof Screens.CreateListing
 */
const MinorLoadingView = memo(({ styles }) => (
  <View style={styles.minorLoadingContainer}>
    <BouncePulse bottom={0.6 * screenHeight} />
  </View>
));

/**
 * @function CreateListing
 * @memberof Screens.CreateListing
 * @param {Object} navigation - The object used to navigate between screens.
 * @param {Object} route - Information about the current route.
 * @description - This is the screen where the user can create a listing.
 * @returns {JSX.Element} - CreateListing screen components
 */
const CreateListing = memo(({ navigation, route }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('');
  const [transactionPreference, setTransactionPreference] = useState('');
  const [data, setData] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isScrollEnabled, setIsScrollEnabled] = useState(true);
  const [isTitleInvalid, setIsTitleInvalid] = useState(false);
  const [isDescriptionInvalid, setIsDescriptionInvalid] = useState(false);
  const [isPriceInvalid, setIsPriceInvalid] = useState(false);
  const [isConditionInvalid, setIsConditionInvalid] = useState(false);
  const [isTransactionPreferenceInvalid, setIsTransactionPreferenceInvalid] =
    useState(false);
  const [isImageInvalid, setIsImageInvalid] = useState(false);
  const [isTagInvalid, setIsTagInvalid] = useState(false);
  const [isMinorLoading, setIsMinorLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useState('$');
  const [showCurrencyOptions, setShowCurrencyOptions] = useState(false);
  const [tagsData, setTagsData] = useState([...tagOptions]);
  const [currencyOptions, setCurrencyOptions] = useState([...currencies]);
  const [selectImageModalVisible, setSelectImageModalVisible] = useState(false);
  const [isCurrencyInvalid, setIsCurrencyInvalid] = useState(false);
  const [pickerKeyTP, setpickerKeyTP] = useState(0);
  const [pickerKeyC, setpickerKeyC] = useState(0);
  const { theme } = useThemeContext();
  const styles = getThemedStyles(theme).CreateListing;

  const titleInput = useRef(null);
  const descriptionInput = useRef(null);
  const priceInput = useRef(null);
  const conditionInput = useRef(null);
  const transactionPreferenceInput = useRef(null);

  /**
   * @function
   * @destructor - resets state variables to default values
   * @memberof Screens.CreateListing
   */
  const destructor = () => {
    setTitle('');
    setDescription('');
    setPrice('');
    setCondition('Select an option...');
    setTransactionPreference('Select an option...');
    setpickerKeyTP((prevKey) => prevKey + 1); // Increment key to force re-render of Transaction Preference Picker
    setpickerKeyC((prevKey) => prevKey + 1); // Increment key to force re-render of Condition Picker
    setData([]);
    setSelectedTags([]);
    setTagsData(tagsData.map((tag) => ({ ...tag, selected: false })));
    setSelectedCurrency('USD');
    setSelectedCurrencySymbol('$');
    setIsScrollEnabled(true);
    setIsTitleInvalid(false);
    setIsDescriptionInvalid(false);
    setIsPriceInvalid(false);
    setIsConditionInvalid(false);
    setIsTransactionPreferenceInvalid(false);
    setIsImageInvalid(false);
    setIsTagInvalid(false);
    setIsCurrencyInvalid(false);
  };

  /**
   * @function checkValidListing
   * @description - checks if the listing is valid and returns a code based on the validity of the listing,
   * @async
   * @returns Returns 0 if the listing is valid, -1 if the listing is invalid and 1 if no images are selected and 2 if too many images are selected and 3 if no tags are selected
   * @memberof Screens.CreateListing
   */
  const checkValidListing = async () => {
    const regex = /^(\d{0,6}(\.\d{2})?)$/;

    setIsPriceInvalid(price === '' || !regex.test(price) || price < 0);
    setIsTitleInvalid(title.length === 0 || title.length > 25);
    setIsDescriptionInvalid(
      description.length === 0 || description.length > 500,
    );
    setIsConditionInvalid(
      !['Excellent', 'Good', 'Fair', 'Poor', 'For Parts'].includes(condition),
    );
    setIsTransactionPreferenceInvalid(
      !['Pickup', 'Meetup', 'Delivery', 'Drop Off', 'No Preference'].includes(
        transactionPreference,
      ),
    );
    setIsImageInvalid(data.length === 0 || data.length > 9);
    setIsTagInvalid(selectedTags.length === 0);
    setIsCurrencyInvalid(selectedCurrency === '');

    if (
      Object.values({
        isPriceInvalid,
        isTitleInvalid,
        isDescriptionInvalid,
        isConditionInvalid,
        isTransactionPreferenceInvalid,
        isImageInvalid,
        isTagInvalid,
        isCurrencyInvalid,
      }).includes(true)
    ) {
      return -1; // Invalid form
    }
    if (data.length === 0) {
      return 1; // No images selected
    }
    if (data.length > 9) {
      return 2; // Too many images
    }
    if (selectedTags.length === 0) {
      return 3; // No tags selected
    }
    return 0; // Valid form
  };

  /**
   * @function handleCreateListing
   * @memberof Screens.CreateListing
   * @async
   * @description - sends user inputted data to server and checks if it ran smoothly
   */
  const handleCreateListing = async () => {
    setIsLoading(true);

    let returnCode = await checkValidListing();
    if (returnCode !== 0) {
      setIsLoading(false); // Turn off loading if validation fails
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
        formData.append(`image_${index}`, {
          uri: image.uri,
          name: `image_${index}.jpg`,
          type: 'image/jpeg',
        });
      });

      let location = await getLocationWithRetry();
      const { latitude, longitude } = location.coords;
      const locationString = JSON.stringify({ latitude, longitude });
      formData.append('location', locationString);

      formData.append('price', price);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('tags', JSON.stringify(selectedTags));
      formData.append('username', getStoredUsername());
      formData.append('condition', condition);
      formData.append('transactionPreference', transactionPreference);
      formData.append('currency', selectedCurrency);
      formData.append('currencySymbol', selectedCurrencySymbol);

      const response = await fetch(`${serverIp}/api/createlisting`, {
        method: 'POST',
        body: formData,
        timeout: 10000,
      });

      if (response.status <= 201) {
        const responseData = await response.json();
        destructor();
        navigation.navigate('Home', { refresh: true });
      } else {
        console.error('HTTP error! Status: ', response.status);
        Alert.alert('Error', 'Failed to create listing.');
      }
    } catch (error) {
      console.error(error);
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * calls the getPermissionAsync function when the component mounts
   */
  useEffect(() => {
    getPermissionAsync();
  }, []);

  /**
   * @function getPermissionAsync
   * @async
   * @description asks for permission to access camera roll
   * @memberof Screens.CreateListing
   */
  const getPermissionAsync = async () => {
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
   * @function showModal
   * @description shows the modal that contains camera/photo library options, changes the state of selectImageModalVisible to true
   * @memberof Screens.CreateListing
   */
  const showModal = () => setSelectImageModalVisible(true);
  /**
   * @function hideModal
   * @description hides the modal that contains camera/photo library options, changes the state of selectImageModalVisible to false
   * @memberof Screens.CreateListing
   */
  const hideModal = () => setSelectImageModalVisible(false);

  /**
   * @function handleCameraPick
   * @returns Returns the photos that the user took
   * @async
   * @description - allows the user to take photos with their camera
   * @memberof Screens.CreateListing
   */
  const handleCameraPick = async () => {
    if (data.length >= 9) {
      Alert.alert(
        'Too many images',
        'Please select no more than 9 images. Try deleting some images.',
      );
      return;
    }

    setIsMinorLoading(true);
    const result = await ImagePicker.launchCameraAsync();

    if (!result.canceled) {
      processImage(result); // Process the first (and only) image
    }
    setIsMinorLoading(false);
    hideModal();
  };

  /**
   * @function handleLibraryPicky
   * @returns Returns the images that the user selected
   * @description - allows the user to select images from their library
   * @async
   * @memberof Screens.CreateListing
   */
  const handleLibraryPick = async () => {
    if (data.length >= 9) {
      Alert.alert(
        'Too many images',
        'Please select no more than 9 images. Try deleting some images.',
      );
      return;
    }

    setIsMinorLoading(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 9 - data.length,
    });
    if (!result.canceled && result.assets) {
      processSelectedImages(result.assets);
    }
    setIsMinorLoading(false);
    hideModal();
  };

  /**
   * @function processImage
   * @param {Object} image - object that holds the image that the user selected
   * @returns Returns the image that the user selected
   * @description - processes the image that the user selected in the case that the user only selects one image
   * @memberof Screens.CreateListing
   */
  const processImage = async (image) => {
    // Process a single image
    const manipulatedImage = await manipulateImage(image.uri);
    if (manipulatedImage) {
      setData((currentData) => [...currentData, manipulatedImage]);
    }
  };

  /**
   * @function processSelectedImages
   * @param {Array} assets - array that holds the images that the user selected
   * @description processes the images that the user selected in the case that the user selects multiple images
   * @memberof Screens.CreateListing
   */
  const processSelectedImages = async (assets) => {
    // Process multiple images
    const processedImages = await Promise.all(
      assets.map(async (asset) => manipulateImage(asset.uri)),
    );
    setData((currentData) => [
      ...currentData,
      ...processedImages.filter(Boolean),
    ]);
  };

  /**
   * @function manipulateImage
   * @param {string} uri - uri of the image that the user selected
   * @returns - an object with the name, key, and image file
   * @memberof Screens.CreateListing
   * @description - compresses the image that the user selected
   */
  const manipulateImage = async (uri) => {
    try {
      const originalSize = await FileSystem.getInfoAsync(uri);
      const manipulateResult = await ImageManipulator.manipulateAsync(uri, [], {
        compress: 0.4,
        format: ImageManipulator.SaveFormat.JPEG,
      });
      const compressedSize = await FileSystem.getInfoAsync(
        manipulateResult.uri,
      );
      const savedData = originalSize.size - compressedSize.size;

      console.log(
        `Original File Size for ${uri}:`,
        (originalSize.size / (1024 * 1024)).toFixed(2),
        'MB',
        `compressed to :`,
        (compressedSize.size / (1024 * 1024)).toFixed(2),
        'MB',
        `data saved: ${(savedData / (1024 * 1024)).toFixed(2)} MB`,
      );

      setIsImageInvalid(false);
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
   * @function handleDeletePhoto
   * @param {Number} index - index of the photo that the user wants to delete
   * @returns - prompts a box to confirm, then removes the photo
   * @description - deletes the photo that the user selected
   * @memberof Screens.CreateListing
   */
  const handleDeletePhoto = (index) => {
    Alert.alert('Delete Photo', 'Are you sure you want to delete this photo?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => {
          setData((currentData) => currentData.filter((_, i) => i !== index));
          if (data.length >= 1 || data.length <= 9) {
            setIsImageInvalid(false);
          }
        },
      },
    ]);
  };

  /**
   * @function render_item
   * @param {Object} item - object that holds the image that the user selected
   * @param {number} index - index of the item in the list of images
   * @description - renders the images that the user selected
   * @returns Returns the images that the user selected
   * @memberof Screens.CreateListing
   */
  const render_item = (item, index) => {
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
              onPress={() => handleDeletePhoto(index)}
            >
              <Text style={styles.deleteButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.item_text}>{item.name}</Text>
        )}
      </View>
    );
  };

  /**
   * @function handleDragStart
   * @description - disables scrolling when the user is dragging an image in the draggable grid
   * @memberof Screens.CreateListing
   */
  const handleDragStart = () => {
    setIsScrollEnabled(false);
  };

  /**
   * @function handleDragRelease
   * @description - enables scrolling when the user releases an image in the draggable grid
   * @memberof Screens.CreateListing
   */
  const handleDragRelease = (data) => {
    setData(data);
    setIsScrollEnabled(true);
  };

  /**
   * @function handlePriceChange
   * @param {string} text - text that hold the entered price
   * @description - handles when the user enters a price
   * @returns {void} This function doesn't return a value
   * @memberof Screens.CreateListing
   */
  const handlePriceChange = (text) => {
    const regex = /^(\d{0,6}(\.\d{2})?)$/;

    if (regex.test(text) || text === '') {
      // If text matches the format (4 digits before decimal, 2 after) or is empty
      setIsPriceInvalid(false);
    } else {
      // If the text doesn't match the format
      setIsPriceInvalid(true);
    }
  };

  /**
   * @function handleTagPress
   * @param {Number} index - index of the tag that the user pressed
   * @param {String} pressedTagName - name of the tag that the user pressed
   * @param {Boolean} isAlreadySelected - boolean that checks if the tag is already selected
   * @param {Array} newSelectedTags - array of the selected tags
   * @param {Array} newTagsData - array of the tags data
   * @param {Array} tagsData - array of the tags data
   * @param {Array} selectedTags - array of the selected tags
   * @description - handles when the user presses a tag
   * @returns Returns the tags that the user selected
   * @memberof Screens.CreateListing
   */
  const handleTagPress = (index) => {
    setIsTagInvalid(false);
    const newTagsData = tagsData.map((tag, idx) => {
      if (idx === index) {
        return { ...tag, selected: !tag.selected };
      }
      return tag;
    });

    const pressedTagName = newTagsData[index].name;
    const isAlreadySelected = selectedTags.includes(pressedTagName);

    let newSelectedTags;
    if (isAlreadySelected) {
      newSelectedTags = selectedTags.filter(
        (tagName) => tagName !== pressedTagName,
      );
    } else {
      newSelectedTags = [...selectedTags, pressedTagName];
    }

    setTagsData(newTagsData);
    setSelectedTags(newSelectedTags);
  };

  /**
   * @function groupTagsIntoRows
   * @description - Groups the tags into rows for the tag field
   * @param {Array} tags - array of tags
   * @param {number} itemsPerRow - of items to display per row
   * @returns {Array} - returns the array with tags grouped together
   * @memberof Screens.CreateListing
   */
  const groupTagsIntoRows = (tags, itemsPerRow) => {
    return tags.reduce((rows, tag, index) => {
      if (index % itemsPerRow === 0) rows.push([]);
      rows[rows.length - 1].push(tag);
      return rows;
    }, []);
  };

  const handleCurrencySelection = (currencyName, currencySymbol) => {
    setSelectedCurrency(currencyName);
    setSelectedCurrencySymbol(currencySymbol);
    setShowCurrencyOptions(false);
  };

  const renderCurrencyOptions = () => {
    return currencyOptions.map((currency) => (
      <TouchableOpacity
        key={currency.name}
        onPress={() => handleCurrencySelection(currency.name, currency.symbol)}
      >
        <Text style={styles.currencyOption}>
          {selectedCurrency === currency.name ? '✓ ' : ''}
          {`${currency.name} ${currency.symbol}`}
        </Text>
      </TouchableOpacity>
    ));
  };

  const rowsOfTags = groupTagsIntoRows(tagsData, 3);
  return (
    <View style={styles.wrapper}>
      {Platform.OS === 'android' ? (
        <TopBar imageVisible={!showCurrencyOptions} />
      ) : (
        <TopBar imageVisible={true} />
      )}

      <View style={styles.scrollfield}>
        <ScrollView scrollEnabled={isScrollEnabled}>
          <View style={styles.rowContainer}>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Title</Text>
              {isTitleInvalid ? (
                <View style={styles.rowContainer}>
                  <Text style={styles.asterisk}> *</Text>
                  <Text style={styles.errorMessage}>
                    {title == ''
                      ? 'Title is required'
                      : title.length > 25
                        ? 'Title too long'
                        : 'Must enter a valid title'}
                  </Text>
                </View>
              ) : (
                ''
              )}
            </View>
            <Text style={styles.characterCounter}>{title.length}/25</Text>
          </View>
          <TextInput
            ref={titleInput}
            style={[
              styles.input,
              isTitleInvalid
                ? theme === 'dark'
                  ? { borderColor: Colors.BB_violet, borderWidth: 1 }
                  : { borderColor: Colors.BB_red, borderWidth: 1 }
                : null,
              theme === 'dark'
                ? { backgroundColor: '#2d2d30', color: Colors.white }
                : null,
            ]}
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              setIsTitleInvalid(false);
            }}
            returnKeyType="next"
            onSubmitEditing={() => descriptionInput.current.focus()}
            maxLength={25}
          />
          <View style={styles.rowContainer}>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Description</Text>
              {isDescriptionInvalid && (
                <View style={styles.rowContainer}>
                  <Text style={styles.asterisk}> *</Text>
                  <Text style={styles.errorMessage}>
                    {description.length > 500
                      ? 'Description too long'
                      : description.length === 0
                        ? 'Description is required'
                        : 'Must enter a valid description'}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.characterCounter}>
              {description.length}/500
            </Text>
          </View>
          <TextInput
            ref={descriptionInput}
            style={[
              styles.input,
              styles.multilineInput,
              (textAlign = 'left'),
              isDescriptionInvalid
                ? theme === 'dark'
                  ? { borderColor: Colors.BB_violet, borderWidth: 1 }
                  : { borderColor: Colors.BB_red, borderWidth: 1 }
                : null,
              theme === 'dark'
                ? { backgroundColor: '#2d2d30', color: Colors.white }
                : null,
            ]}
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              setIsDescriptionInvalid(false);
            }}
            multiline={true}
            textAlignVertical="top"
            returnKeyType="next"
            onSubmitEditing={() => priceInput.current.focus()}
            maxLength={500}
          />

          <View style={styles.rowContainer}>
            <Text style={styles.label}>Price</Text>
            {isPriceInvalid ? (
              <View style={styles.rowContainer}>
                <Text style={styles.asterisk}> *</Text>
                <Text style={styles.errorMessage}>
                  {price == ''
                    ? 'Price is required'
                    : /^(\d{0,6}(\.\d{2})?)$/.test(price)
                      ? 'Must enter a valid price'
                      : price < 0
                        ? 'Invalid price'
                        : price >= 1000000
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
              <TouchableOpacity onPress={() => setShowCurrencyOptions(true)}>
                <View
                  style={[
                    styles.currencyButton,
                    theme === 'dark' ? { backgroundColor: '#1e1e1e' } : null,
                  ]}
                >
                  <Text style={styles.currencyButtonText}>
                    {selectedCurrency} {selectedCurrencySymbol}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <TextInput
              ref={priceInput}
              style={[
                styles.input,
                { width: '94.5%', marginLeft: -101.5 },
                isPriceInvalid
                  ? theme === 'dark'
                    ? { borderColor: Colors.BB_violet, borderWidth: 1 }
                    : { borderColor: Colors.BB_red, borderWidth: 1 }
                  : null,
                theme === 'dark'
                  ? { backgroundColor: '#2d2d30', color: Colors.white }
                  : null,
              ]}
              value={price}
              onChangeText={(text) => {
                setPrice(text);
                setIsPriceInvalid(false);
                handlePriceChange(text);
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
            {Platform.OS == 'ios' && (
              <View
                style={[
                  styles.pickerBackground,
                  theme === 'dark' ? { backgroundColor: '#2d2d30' } : null,
                ]}
              />
            )}
            <RNPickerSelect
              key={pickerKeyTP}
              ref={transactionPreferenceInput}
              selectedValue={transactionPreference}
              onValueChange={(itemValue, itemIndex) => {
                setTransactionPreference(itemValue);
                setIsTransactionPreferenceInvalid(false);
              }}
              items={[
                { label: 'Select an option...', value: 'Select an option...' },
                { label: 'Pickup', value: 'Pickup' },
                { label: 'Meetup', value: 'Meetup' },
                { label: 'Delivery', value: 'Delivery' },
                { label: 'Drop Off', value: 'Drop Off' },
                { label: 'No Preference', value: 'No Preference' },
              ]}
              placeholder={{}}
              style={{
                inputIOS: {
                  color: theme === 'dark' ? Colors.white : Colors.black,
                  left: 5,
                  width: screenWidth * 0.9,
                  height: 40,
                  borderRadius: 5,
                },
                inputAndroid: {
                  color: theme === 'dark' ? Colors.white : Colors.black,
                  left: 5,
                },
              }}
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
                <Text style={styles.errorMessage}>Must select a condition</Text>
              </View>
            ) : (
              ''
            )}
          </View>
          <View style={{ ...styles.pickerStyle }}>
            {Platform.OS == 'ios' && (
              <View
                style={[
                  styles.pickerBackground,
                  theme === 'dark' ? { backgroundColor: '#2d2d30' } : null,
                ]}
              />
            )}
            <RNPickerSelect
              key={pickerKeyC}
              ref={conditionInput}
              selectedValue={condition}
              onValueChange={(itemValue, itemIndex) => {
                setCondition(itemValue);
                setIsConditionInvalid(false);
              }}
              items={[
                { label: 'Select an option...', value: 'Select an option...' },
                { label: 'Excellent', value: 'Excellent' },
                { label: 'Good', value: 'Good' },
                { label: 'Fair', value: 'Fair' },
                { label: 'Poor', value: 'Poor' },
                { label: 'For Parts', value: 'For Parts' },
              ]}
              placeholder={{}}
              style={{
                inputIOS: {
                  color: theme === 'dark' ? Colors.white : Colors.black,
                  left: 5,
                  width: screenWidth * 0.9,
                  height: 40,
                  borderRadius: 5,
                },
                inputAndroid: {
                  color: theme === 'dark' ? Colors.white : Colors.black,
                  left: 5,
                },
              }}
            />
          </View>

          <TouchableOpacity onPress={showModal} style={styles.button}>
            <Text style={styles.buttonText}>Select Images</Text>
          </TouchableOpacity>
          <View
            style={[
              styles.imageField,
              isImageInvalid
                ? theme === 'dark'
                  ? { borderColor: Colors.BB_violet, borderWidth: 1 }
                  : { borderColor: Colors.BB_red, borderWidth: 1 }
                : null,
              theme === 'dark' ? { backgroundColor: '#2d2d30' } : null,
            ]}
          >
            <View style={styles.innerField}>
              <DraggableGrid
                numColumns={3}
                renderItem={(item, index) => render_item(item, index)}
                data={data}
                onDragRelease={handleDragRelease}
                onDragStart={handleDragStart}
              />
            </View>
          </View>
          <ScrollView
            style={[
              styles.tagField,
              isTagInvalid
                ? theme === 'dark'
                  ? { borderColor: Colors.BB_violet, borderWidth: 1 }
                  : { borderColor: Colors.BB_red, borderWidth: 1 }
                : null,
              theme === 'dark' ? { backgroundColor: '#2d2d30' } : null,
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
                        handleTagPress(tagIndex + rowIndex * 3);
                        if (selectedTags.length > 0) {
                          setIsTagInvalid(false);
                        }
                      }}
                    >
                      <View
                        style={[
                          styles.tagSelected,
                          theme === 'dark'
                            ? { backgroundColor: Colors.BB_violet }
                            : null,
                          { opacity: tag.selected ? 1 : 0.3 },
                        ]}
                      />
                      <View
                        style={[
                          styles.rhombus,
                          theme === 'dark'
                            ? { backgroundColor: Colors.white }
                            : null,
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

          <TouchableOpacity onPress={handleCreateListing}>
            <View style={[styles.createButton, (top = 30), (bottom = 0)]}>
              <Text style={styles.buttonText}>Create Listing</Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.spacer} />
        </ScrollView>

        {showCurrencyOptions && (
          <Modal visible={showCurrencyOptions} animationType="slide">
            <View style={styles.modalHeader} />
            <ScrollView style={styles.currencyScrollView}>
              <View style={styles.modalContent}>
                <View style={styles.currencyOptionsContainer}>
                  {renderCurrencyOptions()}
                </View>
              </View>
            </ScrollView>
            <View style={styles.modalFooter} />
            <TouchableOpacity
              onPress={() => setShowCurrencyOptions(false)}
              style={styles.closeButtonContainer}
            >
              <View style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </View>
            </TouchableOpacity>
          </Modal>
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={selectImageModalVisible}
          onRequestClose={() => {
            hideModal();
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={styles.imagePickerButton}
                onPress={handleCameraPick}
              >
                <Text style={styles.imagePickerButtonText}>Camera</Text>
                <MaterialIcons
                  name="camera-alt"
                  size={24}
                  color={theme === 'dark' ? Colors.BB_violet : Colors.black}
                  style={{ top: 10, left: '90%' }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.imagePickerButton}
                onPress={handleLibraryPick}
              >
                <Text style={styles.imagePickerButtonText}>Photo Library</Text>
                <MaterialIcons
                  name="photo-library"
                  size={24}
                  color={theme === 'dark' ? Colors.BB_violet : Colors.black}
                  style={{ top: 10, left: '50%' }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.imagePickerButton}
                onPress={() => hideModal()}
              >
                <Text style={styles.imagePickerButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      {isMinorLoading && <MinorLoadingView styles={styles} />}
      {isLoading && <LoadingView styles={styles} />}
    </View>
  );
});

export default CreateListing;
