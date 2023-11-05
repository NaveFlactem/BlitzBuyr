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
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import * as SecureStore from "expo-secure-store";

const UserListingsRoute = ({ profileInfo }) => (
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
            {item.images.length > 0 && (
              <Image
                source={{
                  uri: `${serverIp}/img/${item.images[0]}`, // load the listing's first image
                }}
                style={{ width: "100%", height: "100%", borderRadius: 12 }}
              />
            )}
          </View>
        )}
      />
    ) : (
      <Text style={styles.noListingsText}>No user listings found.</Text>
    )}
  </View>
);

const LikedListingsRoute = ({ profileInfo }) => (
  <View style={{ flex: 1 }}>
    {profileInfo.likedListings.length > 0 ? (
      <FlatList
        data={profileInfo.likedListings}
        numColumns={3}
        renderItem={({ item }) => (
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
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState("");
  const [loggedUser, setLoggedUser] = useState(""); // this needs to be a global state or something, after auth so we don't keep doing this everywhere.

  useEffect(() => {
    const fetchUsername = async () => {
      const username = await SecureStore.getItemAsync("username");
      setLoggedUser(username);
      if (route.params?.username) {
        console.log(`Setting username to passed username ${profileName}`);
        // we navigated with a username passed as param (i.e. clicking someone's profile)
        setProfileName(route.params.username);
      } else {
        console.log(`Setting username to cached logged in user`);
        setProfileName(username);
      }
    };

    fetchUsername();
  }, [navigation, route.params?.username]); // called when navigation is updated (clicking the page, or when username is changed)

  // get user's profile when the username changes
  useEffect(() => {
    setLoading(true);
    if (profileName !== "") getProfileInfo(profileName);
  }, [profileName]);

  // this is just to print out a profile's information for now
  useEffect(() => {
    setLoading(false);
    console.log("User's Listings:", profileInfo.userListings);
    console.log("User's Liked Listings:", profileInfo.likedListings);
    console.log("User's Ratings:", profileInfo.userRatings);
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

  const [routes] = useState([
    { key: "first", title: "My Listings" },
    { key: "second", title: "Liked Listings" },
  ]);

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: "gray",
      }}
      style={{
        backgroundColor: "white",
        height: 44,
      }}
      renderLabel={({ focused, route }) => (
        <Text style={[{ color: "black", fontWeight: "bold", fontSize: 14 }]}>
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
        backgroundColor: "white",
      }}
    >
      <StatusBar backgroundColor={"gray"} />

      {/* //Cover Photo */}
      <View style={{ width: "100%" }}>
        <Image
          source={require("../screens/assets/images/cover.jpg")}
          resizeMode="cover"
          style={{ width: "100%", height: 180 }}
        />
      </View>

      {/* //Profile Picture */}
      <View style={{ flex: 1, alignItems: "center" }}>
        <Image
          source={require("../screens/assets/images/profile.png")}
          resizeMode="contain"
          style={{
            height: 145,
            width: 145,
            borderRadius: 999,
            borderColor: "black",
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
            color: "black",
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
                color: "black",
              }}
            >
              {profileInfo.userListings.length}
            </Text>
            <Text
              style={{
                fontStyle: "normal",
                color: "black",
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
                color: "black",
              }}
            >
              {profileInfo.userRatings.AverageRating
                ? profileInfo.userRatings.AverageRating
                : "N/A"}
            </Text>
            <Text
              style={{
                alignContent: "center",
                fontStyle: "normal",
                color: "black",
              }}
            >
              Rating ({profileInfo.userRatings.RatingCount})
            </Text>
          </View>

          {/* LIKED */}
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
                color: "black",
              }}
            >
              {profileInfo.likedListings.length}
            </Text>
            <Text
              style={{
                fontStyle: "normal",
                color: "black",
              }}
            >
              Liked
            </Text>
          </View>
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
                onPress={() => navigation.navigate("EditProfile")}
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
                  Edit Profile
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* Rate User Button */}
          {profileName !== loggedUser && (
            <TouchableOpacity
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
                if (profileName !== loggedUser) {
                  route.title = `${profileName}'s listings`;
                } else {
                  route.title = `My listings`;
                }
                return <UserListingsRoute profileInfo={profileInfo} />;
              case "second":
                if (profileName !== loggedUser) {
                  return null; // Hide the LikedListingsRoute when on another's profile
                } else {
                  return <LikedListingsRoute profileInfo={profileInfo} />;
                }
              default:
                return null;
            }
          }}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
        />
      </View>
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
    color: "black",
  },
  logoutButton: {
    width: 110,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "blue",
    borderRadius: 10,
    marginHorizontal: 10,
    top: 10,
  },
  logoutButtonText: {
    fontStyle: "normal",
    color: "white",
  },
});

export default memo(ProfileScreen);
