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
  ActivityIndicator,
  useFocusEffect,
} from "react-native";
import Colors from "../constants/Colors";
import { FlatList, TouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { TabBar, TabView } from "react-native-tab-view";
import * as SecureStore from "expo-secure-store";
import {
  getStoredUsername,
  getStoredPassword,
  setStoredCredentials,
} from "./auth/Authenticate.js";
import { useIsFocused } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import Listing from "../components/Listing.tsx";

const UserListingsRoute = ({ profileInfo, onPressListing }) => (
  <View style={{ flex: 1 }}>
    {profileInfo.userListings.length > 0 ? (
      <FlatList
        data={profileInfo.userListings}
        numColumns={3}
        renderItem={({ item }) => (
            <View
              style={{
                flex: 1,
                aspectRatio: 1,
                margin: 3,
              }}
            >
            <TouchableWithoutFeedback onPress={() => onPressListing(item)}>
              {item.images.length > 0 && (
                <Image
                  source={{
                    uri: `${serverIp}/img/${item.images[0]}`, // load the listing's first image
                  }}
                  style={{ width: "100%", height: "100%", borderRadius: 12 }}
                />
              )}
              </TouchableWithoutFeedback>
            </View>
        )}
      />
    ) : (
      <Text style={styles.noListingsText}>No user listings found.</Text>
    )}
  </View>
);

const LikedListingsRoute = ({ profileInfo, onPressListing }) => (
  <View style={{ flex: 1 }}>
    {profileInfo.likedListings.length > 0 ? (
      <FlatList
        data={profileInfo.likedListings}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onPressListing(item)}>
            <View
              style={{
                flex: 1,
                aspectRatio: 1,
                margin: 3,
              }}
            >
              {item.images.length > 0 && (
                <Image
                  source={{
                    uri: `${serverIp}/img/${item.images[0]}`, // load the listing's first image
                  }}
                  style={{ width: "100%", height: "100%", borderRadius: 12 }}
                />
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    ) : (
      <Text style={styles.noListingsText}>No liked listings found.</Text>
    )}
  </View>
);

function ProfileScreen({ navigation, route }) {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
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
  const [selectedListing, setSelectedListing] = useState(null);
  const [starStates, setStarStates] = useState({});

  const onPressListing = (listingDetails) => {
    setSelectedListing(listingDetails);
  };

  useEffect(() => {
    const fetchUsername = async () => {
      const username = getStoredUsername();
      setLoggedUser(username);
      if (route.params?.username) {
        console.log(
          `Setting username to passed username ${route.params.username}`
        );
        // we navigated with a username passed as param (i.e. clicking someone's profile)
        setProfileName(route.params.username);
      } else {
        console.log(`Setting username to cached logged in user`);
        setProfileName(username);
      }
      getProfileInfo(route.params?.username ? route.params.username : username);
    };

    setLoading(true);
    if (isFocused) {
      fetchUsername();
    }
  }, [isFocused]); // called when navigation is updated (clicking the page, or when username is changed)

  // this is just to print out a profile's information for now
  useEffect(() => {
    setLoading(false);
    /*
    console.log("User's Listings:", profileInfo.userListings);
    console.log("User's Liked Listings:", profileInfo.likedListings);
    console.log("User's Ratings:", profileInfo.userRatings);
    console.log("Profile Picture URL:", profileInfo.profilePicture);
    console.log("Cover Picture URL:", profileInfo.coverPicture);
    */

    if (profileName === loggedUser) {
      setRoutes([
        { key: "first", title: "My Listings" },
        { key: "second", title: "Liked Listings" },
      ]);
    } else {
      setRoutes([{ key: "first", title: `${profileName}'s listings` }]);
    }
  }, [profileInfo]);

  const getProfileInfo = async function (username) {
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

        const initialStarStates = Object.fromEntries(
          [...profileData.likedListings, ...profileData.userListings].map((listing) => [listing.ListingId, listing.liked])
        );
        setStarStates(initialStarStates);

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

  // star states
  const handleStarPress = async (listingId) => {
    // toggle the like
    const newStarStates = { ...starStates }; // Create a copy of the current starStates
    newStarStates[listingId] = !newStarStates[listingId]; // Update the liked status

    const likeData = {
      username: await SecureStore.getItemAsync("username"),
      listingId: listingId,
    };

    // Update the backend
    const likedResponse = await fetch(`${serverIp}/api/like`, {
      method: newStarStates[listingId] ? "POST" : "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(likeData),
    });

    if (likedResponse.status > 201) {
      console.log("Error Liking listing:", listingId, likedResponse.status);
    }

    // Update the state with the new star states object
    setStarStates(newStarStates);

    console.log(
      `${
        newStarStates[listingId] ? "Starred" : "Unstarred"
      } listing ID ${listingId}`
    );
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: Colors.BB_darkRedPurple,
      }}
      style={{
        backgroundColor: Colors.bone,
        height: 44,
      }}
      renderLabel={({ focused, route }) => (
        <Text
          style={[
            {
              color: Colors.BB_darkRedPurple,
              fontWeight: "bold",
              fontSize: 14,
            },
          ]}
        >
          {route.title}
        </Text>
      )}
    />
  );

  async function clearCredentials() {
    try {
      await SecureStore.deleteItemAsync("username");
      await SecureStore.deleteItemAsync("password");
      console.log("Stored credentials cleared.");
    } catch (error) {
      console.error("Error clearing stored credentials:", error);
    }
  }

  const handleLogout = () => {
    clearCredentials();
    setLoading(true);
    navigation.navigate("Login");
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
        backgroundColor: Colors.bone,
      }}
    >
      <StatusBar backgroundColor={"black"} />

      {/* //Cover Photo */}
      <View style={{ width: "100%" }}>
        <Image
          source={{
            uri: profileInfo.coverPicture,
          }}
          resizeMode="cover"
          style={{
            width: "100%",
            height: 180,
            borderWidth: 1,
            borderColor: Colors.BB_darkRedPurple,
          }}
        />
      </View>

      {/* //Profile Picture */}
      <View style={{ flex: 1, alignItems: "center" }}>
        <Image
          source={{
            uri: profileInfo.profilePicture,
          }}
          resizeMode="contain"
          style={{
            height: 145,
            width: 145,
            borderRadius: 999,
            borderColor: Colors.BB_darkRedPurple,
            borderWidth: 2,
            marginTop: -90,
          }}
        />
        <Text
          style={{
            marginTop: 10,
            marginBottom: 5,
            fontStyle: "normal",
            fontWeight: "bold",
            fontSize: 25,
            color: Colors.BB_darkRedPurple,
          }}
        >
          {profileName}
        </Text>

        {/* Rating, Following, Likes */}
        <View
          style={{
            paddingVertical: 2,
            flexDirection: "row",
          }}
        >
          {/* Listings */}
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontStyle: "normal",
                fontWeight: "bold",
                fontSize: 20,
                color: Colors.BB_darkRedPurple,
              }}
            >
              {profileInfo.userListings.length}
            </Text>
            <Text
              style={{
                fontStyle: "normal",
                color: Colors.BB_darkRedPurple,
              }}
            >
              Listings
            </Text>
          </View>
          {/* Rating */}
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              marginHorizontal: 25,
            }}
          >
            <Text
              style={{
                fontStyle: "normal",
                fontWeight: "bold",
                fontSize: 20,
                color: Colors.BB_darkRedPurple,
              }}
            >
              {profileInfo.userRatings.AverageRating
                ? profileInfo.userRatings.AverageRating.toFixed(1)
                : "N/A"}
              {profileInfo.userRatings.RatingCount > 0 && (
                <Entypo
                  name="star"
                  size={25}
                  color="gold"
                  style={styles.ratingStar}
                />
              )}
            </Text>
            <Text
              style={{
                alignContent: "center",
                fontStyle: "normal",
                color: Colors.BB_darkRedPurple,
              }}
            >
              Rating ({profileInfo.userRatings.RatingCount})
            </Text>
          </View>

          {/* LIKED */}
          {profileName === loggedUser && (
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                marginHorizontal: 4,
              }}
            >
              <Text
                style={{
                  fontStyle: "normal",
                  fontWeight: "bold",
                  fontSize: 20,
                  color: Colors.BB_darkRedPurple,
                }}
              >
                {profileInfo.likedListings.length}
              </Text>
              <Text
                style={{
                  fontStyle: "normal",
                  color: Colors.BB_darkRedPurple,
                }}
              >
                Liked
              </Text>
            </View>
          )}
        </View>

        <View style={{ flexDirection: "row", marginTop: 5 }}>
          {/* Logout and Edit Profile Buttons */}
          {profileName === loggedUser && (
            <>
              <TouchableOpacity
                onPress={handleLogout}
                style={styles.logoutButton}
              >
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setLoading(true);
                  navigation.navigate("EditProfile", {
                    profileName: profileName,
                    profilePicture: profileInfo.profilePicture,
                    coverPicture: profileInfo.coverPicture,
                  });
                }}
                style={{
                  width: 124,
                  height: 36,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: Colors.BB_darkRedPurple,
                  borderRadius: 10,
                  marginHorizontal: 10,
                  top: 10,
                  borderWidth: 2,
                  borderColor: "black"
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
                  Edit Profile
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* Rate User Button */}
          {profileName !== loggedUser && (
            <TouchableOpacity
              onPress={() => {
                setLoading(true);
                navigation.navigate("RatingScreen", {
                  profileInfo: profileInfo,
                  username: profileName,
                });
              }}
              style={{
                width: 124,
                height: 36,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "blue",
                borderRadius: 10,
                marginHorizontal: 10,
                top: 10,
              }}
            >
              <Text
                style={{
                  fontStyle: "normal",
                  color: "white",
                }}
              >
                Rate User
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={{ flex: 1, marginHorizontal: 22, marginTop: -150 }}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={({ route }) => {
            switch (route.key) {
              case "first":
                return (
                  <UserListingsRoute
                    profileInfo={profileInfo}
                    onPressListing={onPressListing}
                  />
                );
              case "second":
                return (
                  <LikedListingsRoute
                    profileInfo={profileInfo}
                    onPressListing={onPressListing}
                  />
                );
              default:
                return null;
            }
          }}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
        />
      </View>

      {/* Overlay for displaying selected listing */}
      {selectedListing && (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <Listing
            key={selectedListing.ListingId}
            item={selectedListing}
            starStates={starStates}
            handleStarPress={handleStarPress}
            numItems={selectedListing.images.length}
          />
          <TouchableOpacity onPress={() => setSelectedListing(null)}>
            <Text style={{ color: "white" }}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  noListingsText: {
    textAlign: "center",
    marginTop: 110,
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 20,
    color: Colors.BB_darkRedPurple,
  },
  logoutButton: {
    width: 110,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.BB_darkRedPurple,
    borderRadius: 10,
    marginHorizontal: 10,
    top: 10, 
    borderWidth: 2,
    borderColor: Colors.black
  },
  logoutButtonText: {
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 15,
    color: Colors.white,
  },
  ratingStar: {
    alignSelf: "center",
    position: "absolute",
    width: "30%",
    height: "60%",
    borderRadius: 20,
    shadowColor: "black",
    shadowOpacity: 0.8,
    shadowRadius: 5,
    shadowOffset: {
      height: 2,
      width: 2,
    },
  },
});

export default memo(ProfileScreen);
