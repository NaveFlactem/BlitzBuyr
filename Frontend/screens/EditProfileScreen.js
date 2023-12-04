/**
 * @namespace EditProfile
 * @memberof Screens
 * @description - EditProfileScreen is a screen that allows users to edit their own profile information
 *
 */
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import React, { memo, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import BouncePulse from '../components/visuals/BouncePulse';
import { useThemeContext } from '../components/visuals/ThemeProvider';
import Colors from '../constants/Colors';
import { screenHeight, screenWidth } from '../constants/ScreenDimensions.js';
import { getThemedStyles } from '../constants/Styles';
import { handleDeleteAccount, saveProfileInfo } from '../network/Service.js';
import {
  clearStoredCredentials,
  getStoredPassword,
  getStoredUsername,
  setStoredCredentials,
} from './auth/Authenticate.js';
/**
 *
 * @function EditProfileScreen
 * @memberof Screens.EditProfileScreen
 * @param {Object} navigation - The object used to navigate between screens.
 * @param {Object} route - Information about the current route.
 * @description - Represents a screen for editing user profile information.
 * @returns {JSX.Element} A screen for editing user profile information.
 */

const EditProfileScreen = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState('');
  const [email, setEmail] = useState(route.params.email);
  const [password, setPassword] = useState('');
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [selectedProfilePicture, setSelectedProfilePicture] = useState('');
  const [selectedCoverPicture, setSelectedCoverPicture] = useState('');
  const [selectProfileImageModalVisible, setSelectProfileImageModalVisible] =
    useState(false);
  const [selectCoverImageModalVisible, setSelectCoverImageModalVisible] =
    useState(false);
  const { theme } = useThemeContext();
  const styles = getThemedStyles(useThemeContext().theme).EditProfileScreen;

  /**
   * @function
   * @showModalProfile - shows the modal for selecting a profile picture
   * @setSelectProfileImageModalVisible - sets the modal for selecting a profile picture to visible
   */
  const showModalProfile = () => {
    setSelectProfileImageModalVisible(true);
  };
  /**
   * @function
   * @showModalCover - shows the modal for selecting a cover picture
   * @setSelectCoverImageModalVisible - sets the modal for selecting a cover picture to visible
   */
  const showModalCover = () => {
    setSelectCoverImageModalVisible(true);
  };
  /**
   * @function
   * @hideModal - hides the modal for selecting a picture
   * @setSelectProfileImageModalVisible - sets the modal for selecting a profile picture to invisible
   * @setSelectCoverImageModalVisible - sets the modal for selecting a cover picture to invisible
   */
  const hideModal = () => {
    setSelectProfileImageModalVisible(false);
    setSelectCoverImageModalVisible(false);
  };

  /**
   *
   * @function
   * @name togglePasswordVisibility
   * @memberof EditProfile
   * @returns {void}
   * @description Toggles the visibility of the password input field by switching between hidden and visible states.
   */
  const togglePasswordVisibility = () => {
    setIsPasswordHidden(!isPasswordHidden);
  };

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      setProfileName(route.params.profileName);
      setEmail(route.params.email);
      setSelectedProfilePicture(route.params.profilePicture);
      setSelectedCoverPicture(route.params.coverPicture);
      setPassword(getStoredPassword());
    }
  }, [isFocused]);

  useEffect(() => {
    if (
      loading &&
      profileName !== '' &&
      selectedProfilePicture !== '' &&
      selectedCoverPicture !== ''
    ) {
      setLoading(false);
      console.log('Finished getting original profile data.');
      console.log('Profile Name:', profileName);
      console.log('Password:', password);
      console.log('Profile Picture:', selectedProfilePicture);
      console.log('Cover Picture:', selectedCoverPicture);
    }
  }, [profileName, selectedProfilePicture, selectedCoverPicture, password]);

  /**
   * @function
   * @handleCameraPick - allows the user to take photos with their camera
   * @returns Returns the photos that the user took
   * @description - allows the user to take photos with their camera
   */
  const handleCameraPick = async () => {
    const result = await ImagePicker.launchCameraAsync();

    if (!result.canceled) {
      if (selectProfileImageModalVisible) {
        handleProfileImageSelection(result.assets);
      } else if (selectCoverImageModalVisible) {
        handleCoverImageSelection(result.assets);
      }
    }

    hideModal();
  };

  /**
   * @function
   * @handleLibraryPick - allows the user to select images from their library
   * @returns Returns the images that the user selected
   * @description - allows the user to select images from their library
   */
  const handleLibraryPick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      if (selectProfileImageModalVisible) {
        handleProfileImageSelection(result.assets);
      } else if (selectCoverImageModalVisible) {
        handleCoverImageSelection(result.assets);
      }
    }

    hideModal();
  };

  /**
   *
   * @function
   * @name handleProfileImageSelection
   * @memberof EditProfile
   * @async
   * @returns {void | null} Returns either void if the selection and processing were successful or null if there was an error during image processing.
   * @description Allows the user to select an image from the device's image library, manipulates the selected image to compress it, and sets it as the selected profile picture.
   * @throws {Error} Throws an error if there's an issue during image processing.
   */
  //Functions for touchable opacity prompts for changing profile/cover photo
  const handleProfileImageSelection = async (images) => {
    try {
      const img = images[0]; // Assuming the first image is the one you want
      const manipulateResult = await ImageManipulator.manipulateAsync(
        img.uri,
        [],
        { compress: 0.4, format: ImageManipulator.SaveFormat.JPEG },
      );

      setSelectedProfilePicture(manipulateResult.uri);
      console.log(`Profile picture ${manipulateResult.uri} selected.`);
    } catch (error) {
      console.error('Image processing error:', error);
      return null;
    }
  };

  /**
   *
   * @function
   * @name handleCoverImageSelection
   * @memberof EditProfile
   * @async
   * @returns {void | null} Returns either void if the selection and processing were successful or null if there was an error during image processing.
   * @description Allows the user to select an image from the device's image library and sets it as the selected cover picture.
   * @throws {Error} Throws an error if there's an issue during image processing.
   */

  const handleCoverImageSelection = async (images) => {
    try {
      const img = images[0]; // Assuming the first image is the one you want
      const manipulateResult = await ImageManipulator.manipulateAsync(
        img.uri,
        [],
        { compress: 0.4, format: ImageManipulator.SaveFormat.JPEG },
      );

      setSelectedCoverPicture(manipulateResult.uri);
      console.log(`Cover picture ${manipulateResult.uri} selected.`);
    } catch (error) {
      console.error('Image processing error:', error);
      return null;
    }
  };

  //Function for handling save changes press
  /**
   * Saves the edited profile information by sending it to the server.
   * @function
   * @name saveChanges
   * @memberof EditProfile
   * @async
   * @returns {void}
   * @description Prepares a FormData object with updated profile information, such as username, profile name, password, and images if they have been changed. Submits a POST request to the API to update the user's profile.  Updates local credentials, navigates back to the profile page, and logs the editing process.
   * @throws {Error} Throws an error if there's an issue during the editing process.
   */
  const saveChanges = async () => {
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

    if (profileName === '' || email === '') {
      Alert.alert('Invalid Input', 'Please fill out all fields.');
      return;
    }

    if (!emailPattern.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (profileName.length > 20) {
      Alert.alert('Invalid Input', 'Name must be less than 20 characters.');
      return;
    }

    if (profileName.length < 4) {
      Alert.alert('Invalid Input', 'Name must be at least 4 characters.');
      return;
    }

    const formData = new FormData();
    formData.append('username', getStoredUsername());
    formData.append('profileName', profileName);
    formData.append('email', email);

    if (selectedCoverPicture != route.params.coverPicture) {
      formData.append('coverPicture', {
        uri: selectedCoverPicture,
        name: 'coverPicture.jpg',
        type: 'image/jpeg',
      });
    }

    if (selectedProfilePicture != route.params.profilePicture) {
      formData.append('profilePicture', {
        uri: selectedProfilePicture,
        name: 'profilePicture.jpg',
        type: 'image/jpeg',
      });
    }

    try {
      console.log('New profile data:', formData);

      await saveProfileInfo(formData);
      // update the new credentials locally
      await setStoredCredentials(profileName, password);

      // update the profile page's profile name
      navigation.setOptions({
        params: { profileName: profileName },
      });

      // go back to profile page, FIXME: MAYBE INCLUDE A SUCCESS MESSAGE OR SOMETHING
      navigation.goBack();
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  const [isConfirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [confirmUsername, setConfirmUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  /**
   *
   * @function
   * @name confirmDeletion
   * @memberof EditProfile
   * @returns {void}
   * @description Initiates the deletion process for the user account by calling the 'deleteAccount' function with the username and password.
   */
  const confirmDeletion = async () => {
    try {
      await handleDeleteAccount(confirmUsername, confirmPassword);
      await clearStoredCredentials();
      alert('Account deleted successfully.');
      navigation.navigate('Login');
      setConfirmationModalVisible(false);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  // #endregion
  /**
   *
   * @function
   * @name deleteAccount
   * @memberof EditProfile
   * @async
   * @returns {void}
   * @description Sends a DELETE request to the server to delete the user account using the username and password.
   * @throws {Error} Throws an error if there's an issue during the deletion process.
   */
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <BouncePulse />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeareaview}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarContainer}>
          <TouchableOpacity
            onPress={() => {
              setLoading(true);
              navigation.navigate('BottomNavOverlay');
            }}
          >
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={30}
                color={Colors.BB_bone}
                style={{
                  top:
                    Platform.OS === 'ios'
                      ? 0.035 * screenHeight
                      : 0.045 * screenHeight,
                }}
              />
            </View>
          </TouchableOpacity>
          <View
            style={{
              paddingLeft: 15,
              alignContent: 'center',
              alignSelf: 'center',
            }}
          >
            <Text style={styles.headerText}>Edit Profile</Text>
          </View>
        </View>
      </View>
      {/* Edit Profile and Go Back Arrow Column */}
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        style={{
          backgroundColor: theme === 'dark' ? Colors.black : Colors.BB_bone,
        }}
      >
        {/* CONTENT */}
        {/* Edit Cover Photo */}
        <View style={{ paddingHorizontal: 20, paddingTop: 25 }}>
          <View style={{ marginTopwidth: '100%', position: 'relative' }}>
            <TouchableOpacity onPress={showModalCover}>
              <Image
                source={{
                  uri: selectedCoverPicture,
                }}
                resizeMode="cover"
                style={{
                  width: '100%',
                  height: 180,
                  borderWidth: 1,
                  borderColor:
                    theme === 'dark'
                      ? Colors.BB_violet
                      : Colors.BB_darkRedPurple,
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  bottom: 10,
                  right: 10,
                  zIndex: 9999,
                }}
              >
                <Feather name="edit" size={24} color="black" />
              </View>
            </TouchableOpacity>

            {/* Edit Profile Picture */}
            <View
              style={{
                position: 'absolute',
                top: 90,
                left: screenWidth / 4,
              }}
            >
              <TouchableOpacity onPress={showModalProfile}>
                <Image
                  source={{ uri: selectedProfilePicture }}
                  resizeMode="cover"
                  style={{
                    height: 145,
                    width: 145,
                    borderRadius: 85,
                    borderWidth: 2,
                    borderColor:
                      theme === 'dark'
                        ? Colors.BB_violet
                        : Colors.BB_darkRedPurple,
                  }}
                />

                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 12,
                    zIndex: 9999,
                  }}
                >
                  <MaterialIcons
                    name="photo-camera"
                    size={30}
                    color={theme === 'dark' ? Colors.BB_violet : Colors.black}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'column',
              marginTop: 60,
              paddingVertical: 15,
            }}
          >
            {/* Username */}
            <View style={styles.itemContainer}>
              <Text style={styles.itemTitle}>Username</Text>
              <View style={styles.itemTextField}>
                <TextInput
                  value={profileName}
                  onChangeText={(value) => setProfileName(value)}
                  editable={true}
                  style={
                    theme === 'dark'
                      ? { color: Colors.BB_bone }
                      : { color: Colors.black }
                  }
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.itemContainer}>
              <Text style={styles.itemTitle}>Email</Text>
              <View style={styles.itemTextField}>
                <TextInput
                  value={email}
                  onChangeText={(value) => setEmail(value)}
                  editable={true}
                  style={
                    theme === 'dark'
                      ? { color: Colors.BB_bone }
                      : { color: Colors.black }
                  }
                />
              </View>
            </View>
            <View style={{ paddingVertical: 15 }}>
              <View style={styles.thinHorizontalBar}></View>
            </View>
            {/* SAVE CHANGES + DELETE ACCOUNT */}
            <View
              style={{
                marginTop: 5,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}
            >
              <View style={styles.button}>
                <TouchableOpacity onPress={saveChanges}>
                  <Text style={styles.buttonText}> Save Changes </Text>
                </TouchableOpacity>
              </View>
              {/* DELETE ACCOUNT BUTTON */}
              <TouchableOpacity
                onPress={() => setConfirmationModalVisible(true)}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Delete Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal isVisible={isConfirmationModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>Delete Account</Text>
          <Text style={styles.modalTitle}>
            Deleting your account will also delete all your account data. Enter
            your information to confirm deletion of your account.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={confirmUsername}
            onChangeText={(text) => setConfirmUsername(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
          />
          <TouchableOpacity onPress={confirmDeletion}>
            <View style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>Delete</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setConfirmationModalVisible(false)}>
            <View style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={selectCoverImageModalVisible || selectProfileImageModalVisible}
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
    </SafeAreaView>
  );
};

export default memo(EditProfileScreen);
