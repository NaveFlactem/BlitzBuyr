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
  const [selectedImage, setSelectedImage] = useState("");

  const togglePasswordVisibility = () => {
    setIsPasswordHidden(!isPasswordHidden);
  };

  //Sets text field data = current profile data
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
    setSelectedImage(profileInfo.profilePicture);
  }, [profileInfo.profilePicture]);

  const handleImageSelection = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      console.log("Profile Picture was successfully changed.");
      console.log(result.assets[0].uri);
      setSelectedImage(result.assets[0].uri);
    } else {
      console.log("Profile Picture change function was canceled.");
    }
  };

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
          <MaterialIcons name="keyboard-arrow-left" size={24} color={"black"} />
        </TouchableOpacity>

        <Text
          style={{
            color: "black",
            fontSize: 22,
            fontWeight: "bold",
            left: screenWidth / 4,
          }}
        >
          Edit Profile
        </Text>
      </View>
      <ScrollView>
        {/* Edit Profile Picture */}
        <View
          style={{
            alignItems: "center",
            marginVertical: 22,
          }}
        >
          <TouchableOpacity onPress={handleImageSelection}>
            <Image
              source={{ uri: selectedImage }}
              style={{
                height: 170,
                width: 170,
                borderRadius: 85,
                borderWidth: 2,
                borderColor: "black",
              }}
            />

            <View
              style={{
                position: "absolute",
                bottom: 0,
                right: 10,
                zIndex: 9999,
              }}
            >
              <MaterialIcons name="photo-camera" size={35} color={"black"} />
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "column",
            marginBottom: 6,
          }}
        >
          {/* Username */}
          <Text
            style={{
              color: "black",
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
              borderColor: "gray",
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
              color: "black",
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
              borderColor: "gray",
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
              color: "black",
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
              borderColor: "gray",
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
              <MaterialIcons name="visibility" size={20} color={"black"} />
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
              <TouchableOpacity
                style={{
                  width: 150,
                  height: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "blue",
                  borderRadius: 10,
                  marginVertical: 20,
                }}
              >
                <Text style={{ color: "white" }}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default memo(EditProfileScreen);
