import React, { useEffect, useState, memo } from "react";
import { serverIp } from "../config.js";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from "react-native";
import Colors from "../constants/Colors";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import {
  getStoredUsername,
  getStoredPassword,
  setStoredCredentials,
  clearStoredCredentials,
} from "./auth/Authenticate.js";
import { useIsFocused } from "@react-navigation/native";
import { Feather, Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import Modal from "react-native-modal";
import { screenWidth, screenHeight } from "../constants/ScreenDimensions.js";

const EditProfileScreen = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState("");
  const [email, setEmail] = useState("temporary@temp.com");
  const [password, setPassword] = useState("");
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [selectedProfilePicture, setSelectedProfilePicture] = useState("");
  const [selectedCoverPicture, setSelectedCoverPicture] = useState("");

  const togglePasswordVisibility = () => {
    setIsPasswordHidden(!isPasswordHidden);
  };

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      setProfileName(route.params.profileName);
      setSelectedProfilePicture(route.params.profilePicture);
      setSelectedCoverPicture(route.params.coverPicture);
      setPassword(getStoredPassword());
    }
  }, [isFocused]);

  useEffect(() => {
    if (
      loading &&
      profileName !== "" &&
      selectedProfilePicture !== "" &&
      selectedCoverPicture !== ""
    ) {
      setLoading(false);
      console.log("Finished getting original profile data.");
      console.log("Profile Name:", profileName);
      console.log("Password:", password);
      console.log("Profile Picture:", selectedProfilePicture);
      console.log("Cover Picture:", selectedCoverPicture);
    }
  }, [profileName, selectedProfilePicture, selectedCoverPicture, password]);

  //Functions for touchable opacity prompts for changing profile/cover photo
  const handleProfileImageSelection = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      try {
        const manipulateResult = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [],
          { compress: 0.4, format: ImageManipulator.SaveFormat.JPEG },
        );
        let localUri = manipulateResult.uri;
        let filename = localUri.split("/").pop();

        result = localUri;
      } catch (error) {
        console.error("Image processing error:", error);
        return null;
      }
      setSelectedProfilePicture(result);
      console.log(`Profile picture ${result} selected.`);
    } else {
      console.log("Profile Picture change function was canceled.");
    }
  };

  const handleCoverImageSelection = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      try {
        const manipulateResult = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [],
          { compress: 0.4, format: ImageManipulator.SaveFormat.JPEG },
        );
        let localUri = manipulateResult.uri;
        let filename = localUri.split("/").pop();

        result = localUri;
      } catch (error) {
        console.error("Image processing error:", error);
        return null;
      }
      setSelectedCoverPicture(result);
      console.log(`Cover picture ${result} selected.`);
    } else {
      console.log("Cover Picture change function was canceled.");
    }
  };

  //Function for handling save changes press
  const saveChanges = async () => {
    const formData = new FormData();
    formData.append("username", getStoredUsername());
    formData.append("profileName", profileName);
    formData.append("password", password);

    if (selectedCoverPicture != route.params.coverPicture) {
      formData.append("coverPicture", {
        uri: selectedCoverPicture,
        name: "coverPicture.jpg",
        type: "image/jpeg",
      });
    }

    if (selectedProfilePicture != route.params.ProfilePicture) {
      formData.append("profilePicture", {
        uri: selectedProfilePicture,
        name: "profilePicture.jpg",
        type: "image/jpeg",
      });
    }

    try {
      console.log("FormData:", formData);
      const response = await fetch(`${serverIp}/api/editprofile`, {
        method: "POST",
        body: formData,
        timeout: 10000,
      });

      if (response.status <= 201) {
        const responseData = await response.json();
        console.log("Profile edited successfully:", responseData);

        // update the new credentials locally
        await setStoredCredentials(profileName, password);

        // update the profile page's profile name
        navigation.setOptions({
          params: { profileName: profileName },
        });

        // go back to profile page, WIP MAYBE INCLUDE A SUCCESS MESSAGE OR SOMETHING
        navigation.goBack();
      } else {
        console.error("HTTP error! Status: ", response.status);
      }
      console.log("Saving Changes");
    } catch (error) {
      console.error("Error editing profile:", error);
    }
  };

  const [isConfirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [confirmUsername, setConfirmUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const confirmDeletion = () => {
    deleteAccount(confirmUsername, confirmPassword);
    setConfirmationModalVisible(false);
  };

  const deleteAccount = async () => {
    const response = await fetch(
      `${serverIp}/api/deleteaccount?username=${confirmUsername}&password=${confirmPassword}`,
      {
        method: "DELETE",
        timeout: 10000,
      },
    );

    const responseData = await response.json();

    if (response.ok) {
      console.log(
        `Account ${getStoredUsername} deleted successfully:`,
        responseData,
      );
      await clearStoredCredentials();
      alert("Account deleted successfully.");
      navigation.navigate("Login");
    } else {
      console.log("Error deleting account:", responseData.error);
      alert(`Error deleting account: ${responseData.error}`);
    }
  };

  // #endregion

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 22,
      }}
    >
      {/* Edit Profile and Go Back Arrow Column */}
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 25,
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setLoading(true);
            navigation.navigate("BottomNavOverlay");
          }}
          style={styles.circleContainer}
        >
          <View style={styles.circle}>
            <MaterialCommunityIcons name="arrow-left" size={30} color="black" />
          </View>
        </TouchableOpacity>

        <Text
          style={{
            position: "absolute",
            color: Colors.BB_darkRedPurple,
            fontSize: 22.5,
            fontWeight: "bold",
            top: 20,
          }}
        >
          Edit Profile
        </Text>
      </View>

      <ScrollView style={{ marginTop: 25 }}>
        {/* Edit Cover Photo */}
        <View style={{ marginTop: 25, width: "100%", position: "relative" }}>
          <TouchableOpacity onPress={handleCoverImageSelection}>
            <Image
              source={{
                uri: selectedCoverPicture,
              }}
              resizeMode="cover"
              style={{
                width: "100%",
                height: 180,
                borderWidth: 1,
                borderColor: Colors.BB_darkRedPurple,
              }}
            />
            <View
              style={{
                position: "absolute",
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
              position: "absolute",
              top: 90,
              left: screenWidth / 4,
            }}
          >
            <TouchableOpacity onPress={handleProfileImageSelection}>
              <Image
                source={{ uri: selectedProfilePicture }}
                resizeMode="contain"
                style={{
                  height: 145,
                  width: 145,
                  borderRadius: 85,
                  borderWidth: 2,
                  borderColor: Colors.BB_darkRedPurple,
                }}
              />

              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 12,
                  zIndex: 9999,
                }}
              >
                <MaterialIcons
                  name="photo-camera"
                  size={30}
                  color={Colors.black}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: "column",
            marginBottom: 6,
            marginTop: 60,
          }}
        >
          {/* Username */}
          <Text
            style={{
              color: Colors.BB_darkRedPurple,
              fontWeight: "bold",
              fontSize: 16,
              paddingBottom: 10,
            }}
          >
            Username
          </Text>
          <View
            style={{
              height: 44,
              width: "100%",
              borderColor: Colors.BB_darkRedPurple,
              borderWidth: 1,
              borderRadius: 6,
              justifyContent: "center",
              paddingLeft: 8,
            }}
          >
            <TextInput
              value={profileName}
              onChangeText={(value) => setProfileName(value)}
              editable={true}
            />
          </View>

          {/* Email */}
          <Text
            style={{
              color: Colors.BB_darkRedPurple,
              fontWeight: "bold",
              fontSize: 16,
              paddingBottom: 10,
              paddingTop: 10,
            }}
          >
            Email
          </Text>
          <View
            style={{
              height: 44,
              width: "100%",
              borderColor: Colors.BB_darkRedPurple,
              borderWidth: 1,
              borderRadius: 6,
              justifyContent: "center",
              paddingLeft: 8,
            }}
          >
            <TextInput
              value={email}
              onChangeText={(value) => setEmail(value)}
              editable={true}
            />
          </View>

          {/* Password */}

          <Text
            style={{
              color: Colors.BB_darkRedPurple,
              fontWeight: "bold",
              fontSize: 16,
              paddingBottom: 10,
              paddingTop: 10,
            }}
          >
            Password
          </Text>
          <View
            style={{
              flexDirection: "row",
              height: 44,
              width: "100%",
              borderColor: Colors.BB_darkRedPurple,
              borderWidth: 1,
              borderRadius: 6,
              justifyContent: "center",
              paddingLeft: 8,
            }}
          >
            <TextInput
              value={password}
              onChangeText={(value) => setPassword(value)}
              editable={true}
              secureTextEntry={isPasswordHidden}
              style={{ flex: 9 }}
            />
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 10,
              }}
              onPress={togglePasswordVisibility}
            >
              <MaterialIcons
                name="visibility"
                size={20}
                color={Colors.BB_darkRedPurple}
              />
            </TouchableOpacity>
          </View>

          {/* SAVE CHANGES + DELETE ACCOUNT */}
          <View
            style={{
              top: 10,
              alignItems: "center",
              justifyContent: "center",
              marginHorizontal: 15,
              flexDirection: "row",
            }}
          >
            {/* SAVE CHANGES BUTTON */}
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                onPress={saveChanges}
                style={{
                  width: 130,
                  height: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: Colors.BB_darkRedPurple,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: Colors.black,
                  marginVertical: 20,
                }}
              >
                <Text
                  style={{
                    fontStyle: "normal",
                    color: Colors.white,
                    fontWeight: "500",
                    fontSize: 15,
                  }}
                >
                  Save Changes
                </Text>
              </TouchableOpacity>
            </View>
            {/* DELETE ACCOUNT BUTTON */}
            <View
              style={{
                flex: 1,
              }}
            >
              <TouchableOpacity
                onPress={() => setConfirmationModalVisible(true)}
                style={{
                  width: 130,
                  height: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: Colors.BB_darkRedPurple,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: Colors.black,
                  marginVertical: 20,
                }}
              >
                <Text
                  style={{
                    fontStyle: "normal",
                    color: Colors.white,
                    fontWeight: "500",
                    fontSize: 15,
                  }}
                >
                  Delete Account
                </Text>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalHeader: {
    fontSize: 30,
    textAlign: "center",
    marginVertical: 5,
    color: Colors.BB_darkRedPurple,
  },
  modalContainer: {
    backgroundColor: Colors.BB_bone,
    padding: 20,
    borderRadius: 10,
    borderColor: Colors.BB_darkRedPurple,
    borderWidth: 3,
  },
  modalTitle: {
    fontSize: 12,
    marginBottom: 10,
    color: Colors.BB_darkRedPurple,
    textAlign: "center",
  },
  input: {
    height: 44,
    width: "100%",
    borderColor: Colors.BB_darkRedPurple,
    borderWidth: 1,
    borderRadius: 6,
    justifyContent: "center",
    paddingLeft: 8,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  confirmButton: {
    backgroundColor: Colors.BB_red,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  cancelButton: {
    padding: 10,
  },
  confirmButtonText: {
    color: Colors.white,
    textAlign: "center",
  },
  cancelButtonText: {
    color: Colors.BB_darkRedPurple,
    textAlign: "center",
  },
  circleContainer: {
    position: "absolute",
    top: 15,
    left: Platform.OS == "ios" ? 15 : 0,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "black",
  },
});

export default memo(EditProfileScreen);
