import React, { useEffect, useState, memo } from "react";
import { serverIp } from "../config.js";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  useWindowDimensions,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  useFocusEffect,
} from "react-native";
import Colors from "../constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import {
  FlatList,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native-gesture-handler";
import {
  getStoredUsername,
  getStoredPassword,
  setStoredCredentials,
} from "./auth/Authenticate.js";
import { useIsFocused } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import { Feather } from '@expo/vector-icons'; 
import * as ImagePicker from "expo-image-picker";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const EditProfileScreen = ({ navigation, route }) => {
  const layout = useWindowDimensions();
  const [profileInfo, setProfileInfo] = useState({
    likedListings: [],
    userListings: [],
    userRatings: {},
  });
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState("");
  const [loggedUser, setLoggedUser] = useState(""); // this needs to be a global state or something, after auth so we don't keep doing this everywhere.
  const [routes, setRoutes] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("temporary@temp.com");
  const [password, setPassword] = useState("temp_password");
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [selectedProfileImage, setSelectedProfileImage] = useState("");
  const [selectedCoverImage, setSelectedCoverImage] = useState("");

  const togglePasswordVisibility = () => {
    setIsPasswordHidden(!isPasswordHidden);
  };

  //Sets text field data = current profile data / default data
  useEffect(() => {
    setName(profileName);
  }, [profileName]);

  useEffect(() => {
    setEmail("temporary@temp.com");
  }, ["temporary@temp.com"]);

  useEffect(() => {
    setPassword("temp_password");
  }, ["temp_password"]);

  useEffect(() => {
    setSelectedProfileImage(profileInfo.profilePicture);
  }, [profileInfo.profilePicture]);

  useEffect(() => {
    setSelectedCoverImage(profileInfo.coverPicture);
  }, [profileInfo.profilePicture]);

  //Functions for touchable opacity prompts for changing profile/cover photo

  const handleProfileImageSelection = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      console.log("Profile Picture was successfully changed.");
      setSelectedProfileImage(result.assets[0].uri);
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
      console.log("Cover Photo was successfully changed.");
      console.log(result.assets[0].uri);
      setSelectedCoverImage(result.assets[0].uri);
    } else {
      console.log("Cover Picture change function was canceled.");
    }
  };

  //Function for handling save changes press
  const saveChanges = async () => {
    // Notes: 
    // - Data needed to be fetched: email and password
    // Data to be overwritten
    /* 
       username = (varname: name)
       email = (varname: email)
       password = (varname: password)
       profile picture = (varname: selectedProfileImage)
       cover photo = (varname: selectedCoverImage)
    */  
    //On press this function should overwrite all db data for each of them.

    console.log("Saving Changes");
    
    // Should also call goback to main page: uncomment bottom
    // navigation.navigate("BottomNavOverlay"); 
  }

  // Fetching data

  useEffect(() => {
    const fetchUsername = async () => {
      const username = getStoredUsername();
      setLoggedUser(username);
      if (route.params?.username) {
        console.log(
          `Setting username to passed username ${route.params.username}`
        );
        setProfileName(route.params.username);
      } else {
        console.log(`Setting username to cached logged in user`);
        setProfileName(username);
      }
    };

    fetchUsername();
  }, [navigation, route.params?.username]); // called when navigation is updated (clicking the page, or when username is changed)

  // get user's profile when the username changes or when we open the page
  useEffect(() => {
    setLoading(true);
    if (isFocused) {
      if (profileName !== "") getProfileInfo(profileName);
    }
  }, [isFocused, profileName]);

  // this is just to print out a profile's information for now
  useEffect(() => {
    setLoading(false);

    console.log("User's Listings:", profileInfo.userListings);
    console.log("User's Liked Listings:", profileInfo.likedListings);
    console.log("User's Ratings:", profileInfo.userRatings);
    console.log("Profile Picture URL:", profileInfo.profilePicture);
    console.log("Cover Picture URL:", profileInfo.coverPicture);

    if (profileName === loggedUser) {
      setRoutes([
        { key: "first", title: "My Listings" },
        { key: "second", title: "Liked Listings" },
      ]);
    } else {
      setRoutes([{ key: "first", title: `${profileName}'s listings` }]);
    }
  }, [profileInfo]);

  getProfileInfo = async function (username) {
    console.log(`Fetching profile info for ${username}`);
    try {
      const profileResponse = await fetch(
        `${serverIp}/api/profile?username=${encodeURIComponent(username)}`,
        {
          method: "GET",
        }
      );
      const profileData = await profileResponse.json();

      if (profileResponse.status <= 201) {
        setProfileInfo({
          likedListings: profileData.likedListings,
          userListings: profileData.userListings,
          userRatings: profileData.ratings.reduce(
            (acc, rating) => ({ ...acc, ...rating }),
            {}
          ),
          profilePicture: profileData.profilePicture,
          coverPicture: profileData.coverPicture,
        });

        console.log(`Profile for ${username} fetched successfully`);
      } else {
        console.log(
          "Error fetching profile:",
          profileResponse.status,
          profileData
        );
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

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
          flexDirection: "row",
          paddingTop: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setLoading(true);
            navigation.navigate("BottomNavOverlay");
          }}
        >
          <MaterialIcons
            name="keyboard-arrow-left"
            size={24}
            color={Colors.BB_darkRedPurple}
          />
        </TouchableOpacity>

        <Text
          style={{
            color: Colors.BB_darkRedPurple,
            fontSize: 22,
            fontWeight: "bold",
            left: screenWidth / 4,
          }}
        >
          Edit Profile
        </Text>
      </View>
      <ScrollView>

        {/* Edit Cover Photo */}
        <View style={{ marginTop: 15, width: "100%", position: "relative" }}>
          <TouchableOpacity onPress={handleCoverImageSelection}>
            <Image
              source={{
                uri: selectedCoverImage,
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
                source={{ uri: selectedProfileImage }}
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
              value={name}
              onChangeText={(value) => setName(value)}
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

          {/* SAVE CHANGES BUTTON */}
          <View
            style={{
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <View style={{ flex: 1, top: 15 }}>
              <TouchableOpacity onPress={saveChanges}
                style={{
                  width: 150,
                  height: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: Colors.BB_orange,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: Colors.BB_darkRedPurple,
                  marginVertical: 20,
                }}
              >
                <Text style={{ color: Colors.BB_darkRedPurple }}>
                  Save Changes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default memo(EditProfileScreen);
