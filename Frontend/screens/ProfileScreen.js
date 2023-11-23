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
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Colors from "../constants/Colors";
import {
  FlatList,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { TabBar, TabView } from "react-native-tab-view";
import * as SecureStore from "expo-secure-store";
import {
  getStoredUsername,
  getStoredPassword,
  setStoredCredentials,
  clearStoredCredentials,
} from "./auth/Authenticate.js";
import { useIsFocused } from "@react-navigation/native";
import {
  Entypo,
  MaterialCommunityIcons,
  AntDesign,
  MaterialIcons,
} from "@expo/vector-icons";
import Listing from "../components/Listing.js";
import useBackButtonHandler from "../hooks/DisableBackButton.js";
import BouncePulse from "../components/visuals/BouncePulse.js";
import { getLocationWithRetry } from "../constants/Utilities";
import { Linking } from "react-native";

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
            {item.images.length > 0 && (
              <TouchableOpacity onPress={() => onPressListing(item)}>
                <Image
                  source={{
                    uri: `${serverIp}/img/${item.images[0]}`, // load the listing's first image
                  }}
                  style={{ width: "100%", height: "100%", borderRadius: 12 }}
                />
              </TouchableOpacity>
            )}
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
          <View
            style={{
              flex: 1,
              aspectRatio: 1,
              margin: 3,
            }}
          >
            {item.images.length > 0 && (
              <TouchableOpacity onPress={() => onPressListing(item)}>
                <Image
                  source={{
                    uri: `${serverIp}/img/${item.images[0]}`, // load the listing's first image
                  }}
                  style={{ width: "100%", height: "100%", borderRadius: 12 }}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    ) : (
      <Text style={styles.noListingsText}>No liked listings found.</Text>
    )}
  </View>
);

const handleContactClick = async (key, data) => {
  switch (key) {
    case "email":
      console.log("email");
      try {
        await Linking.openURL(
          `mailto:${data}?subject=${encodeURIComponent(
            "BlitzBuyr"
          )}&body=${encodeURIComponent("")}`
        );
      } catch (error) {
        console.error("Error opening email:", error);
      }
      break;
    case "PhoneNumber":
      try {
        //Future: API to call number. Phone number is in data
      } catch (error) {
        console.error("Error opening phoneNumber:", error);
      }
      break;
    default:
      console.log("default");
      try {
        await Linking.openURL(`http://${key}.com/${data}`);
      } catch (error) {
        console.error(`Error opening ${key}:`, error);
      }
      break;
  }
};

const ContactInfoRoute = ({ selfProfile, contactInfo, setContactInfo }) => {
  let displayValues = Object.values(contactInfo).some(
    (value) => value.data.length > 0
  );

  if (!selfProfile && Object.values(contactInfo).every((value) => value.hidden))
    displayValues = false;

  return (
    <View style={styles.contactInfoContainer}>
      <ScrollView>
        <View>
          {displayValues ? (
            Object.entries(contactInfo).map(([key, value]) => {
              if (value.data.length > 0) {
                return (
                  (selfProfile || (!selfProfile && !value.hidden)) && (
                    <View key={key}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        {/* Icon + Handle */}
                        <TouchableOpacity
                          onPress={() => handleContactClick(key, value.data)}
                          style={styles.socialIcons}
                        >
                          <AntDesign
                            name={value.icon}
                            size={24}
                            color="black"
                            style={{
                              opacity: value.hidden ? 0.25 : 1.0,
                            }}
                          />
                          <Text
                            style={[
                              styles.socialText,
                              { opacity: value.hidden ? 0.25 : 1.0 },
                            ]}
                          >
                            {value.data}
                          </Text>
                        </TouchableOpacity>
                        {/* Visibility */}
                        {selfProfile && (
                          <TouchableOpacity
                            onPress={() => {
                              setContactInfo((prevContactInfo) => ({
                                ...prevContactInfo,
                                [key]: {
                                  ...prevContactInfo[key],
                                  hidden: !prevContactInfo[key].hidden,
                                  // This is where the contact hidden table should be changed
                                },
                              }));
                            }}
                            style={[
                              styles.socialIcons,
                              { opacity: value.hidden ? 0.25 : 1.0 },
                            ]}
                          >
                            <MaterialIcons
                              name="visibility"
                              size={24}
                              color={Colors.BB_darkRedPurple}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  )
                );
              }
            })
          ) : (
            <Text style={styles.noListingsText}>
              No Contact Information Available.
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

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
  const [selfProfile, setSelfProfile] = useState(null); // this needs to be a global state or something, after auth so we don't keep doing this everywhere.
  const [routes, setRoutes] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [LikeStates, setLikeStates] = useState({});

  // Use states for contact info
  const [contactInfo, setContactInfo] = useState({
    phoneNumber: { data: "2132149702", hidden: false, icon: "phone" },
    email: { data: "Email", hidden: false, icon: "mail" },
    linkedIn: { data: "LinkedIn", hidden: false, icon: "linkedin-square" },
    instagram: { data: "Instagram", hidden: false, icon: "instagram" },
    facebook: { data: "Facebook", hidden: false, icon: "facebook-square" },
    twitter: { data: "Twitter", hidden: false, icon: "twitter" },
  });

  const onBackPress = () => {
    return true;
  };

  useBackButtonHandler(onBackPress);

  const onPressListing = (listingDetails) => {
    setSelectedListing(listingDetails);
  };

  useEffect(() => {
    const fetchUsername = async () => {
      const username = getStoredUsername();
      if (route.params?.username) {
        console.log(
          `Setting username to passed username ${route.params.username}`
        );
        // we navigated with a username passed as param (i.e. clicking someone's profile)
        setProfileName(route.params.username);
        setSelfProfile(false);
      } else {
        console.log(`Setting username to cached logged in user`);
        setProfileName(username);
        setSelfProfile(true);
      }
      getProfileInfo(route.params?.username ? route.params.username : username);
    };

    const getUserLocation = async () => {
      console.log("Getting user's location...");

      try {
        const location = await getLocationWithRetry();
        const { latitude, longitude } = location.coords;
        setUserLocation({ latitude, longitude });
      } catch (error) {
        console.error("Error getting location:", error);
        // FIXME: Handle the error appropriately
      }
    };

    setLoading(true);
    if (isFocused) {
      fetchUsername();
      getUserLocation();
    }
  }, [isFocused]); // called when navigation is updated (clicking the page, or when username is changed)

  // this is just to print out a profile's information for now
  useEffect(() => {
    if (userLocation && profileInfo) {
      setLoading(false);
    }

    if (selfProfile) {
      setRoutes([
        { key: "first", title: "My Listings" },
        { key: "second", title: "Liked" },
        { key: "third", title: "Contact" },
      ]);
    } else {
      setRoutes([
        { key: "first", title: `${profileName}'s listings` },
        { key: "third", title: `${profileName}'s contact` },
      ]);
    }
  }, [profileInfo, userLocation]);

  const getProfileInfo = async function (username) {
    console.log(`Fetching profile info for ${username}`);
    try {
      const fetchUrl = `${serverIp}/api/profile?username=${encodeURIComponent(
        getStoredUsername()
      )}&password=${getStoredPassword()}&profileName=${username}`;
      console.log(fetchUrl);
      const profileResponse = await fetch(fetchUrl, {
        method: "GET",
      });
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
        console.log(contactInfo);
        console.log(profileData.contactInfo);

        // Set the contactInfo state
        const updatedContactInfo = { ...contactInfo };
        for (const key in profileData.contactInfo) {
          updatedContactInfo[key].hidden = profileData.contactInfo[key].hidden;
          updatedContactInfo[key].data = profileData.contactInfo[key].data;
        }
        setContactInfo(updatedContactInfo);

        const initialLikeStates = Object.fromEntries(
          [...profileData.likedListings, ...profileData.userListings].map(
            (listing) => [listing.ListingId, listing.liked]
          )
        );
        setLikeStates(initialLikeStates);

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

  // Like states
  const handleLikePress = async (listingId) => {
    // toggle the like
    const newLikeStates = { ...LikeStates }; // Create a copy of the current LikeStates
    newLikeStates[listingId] = !newLikeStates[listingId]; // Update the liked status

    const likeData = {
      username: await SecureStore.getItemAsync("username"),
      listingId: listingId,
    };

    // Update the backend
    const likedResponse = await fetch(`${serverIp}/api/like`, {
      method: newLikeStates[listingId] ? "POST" : "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(likeData),
    });

    if (likedResponse.status > 201) {
      console.log("Error Liking listing:", listingId, likedResponse.status);
    }

    // Update the state with the new Like states object
    setLikeStates(newLikeStates);

    console.log(
      `${
        newLikeStates[listingId] ? "Likered" : "UnLikered"
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
              textAlign: "center",
            },
          ]}
        >
          {route.title}
        </Text>
      )}
    />
  );

  const handleLogout = () => {
    clearStoredCredentials();
    setLoading(true);
    navigation.navigate("Login");
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <BouncePulse />
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
            height: 0.2 * screenHeight,
            borderWidth: 1,
            borderColor: Colors.BB_darkRedPurple,
            position: "absolute",
          }}
        />
        {/* Back button */}
        {!selfProfile && (
          <TouchableOpacity
            onPress={() => {
              setLoading(true);
              navigation.navigate("BottomNavOverlay");
            }}
            style={styles.circleContainer}
          >
            <View style={styles.circle}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={30}
                color="black"
              />
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* //Profile Picture */}
      <View style={{ flex: 1, alignItems: "center" }}>
        <Image
          source={{
            uri: profileInfo.profilePicture,
          }}
          resizeMode="contain"
          style={{
            height: 0.38 * screenWidth,
            width: 0.38 * screenWidth,
            borderRadius: 999,
            borderColor: Colors.BB_darkRedPurple,
            borderWidth: 2,
            marginTop: -90,
            position: "absolute",
            top: 0.2 * screenHeight,
          }}
        />
        <Text
          style={{
            top: 0.28 * screenHeight,
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
            top: 0.28 * screenHeight,
            alignItems: "center",
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
              marginHorizontal: selfProfile ? 25 : 10,
              marginEnd: !selfProfile ? -10 : 25,
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
                  size={20}
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
          {selfProfile && (
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
        {/* Logout and Edit Profile Buttons */}
        {selfProfile && (
          <View
            style={{
              flexDirection: "row",
              marginTop: 5,
              top: 0.28 * screenHeight,
              marginBottom: -100,
            }}
          >
            <TouchableOpacity onPress={handleLogout} style={styles.button}>
              <Text style={styles.buttonText}>Logout</Text>
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
              style={{ ...styles.button, width: 114 }}
            >
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Rate User Button */}
        {!selfProfile && (
          <View
            style={{
              flexDirection: "row",
              marginTop: 5,
              top: 0.28 * screenHeight,
              marginBottom: -100,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setLoading(true);
                navigation.navigate("RatingScreen", {
                  profileInfo: profileInfo,
                  username: profileName,
                });
              }}
              style={{ ...styles.button }}
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
          </View>
        )}
      </View>

      <View
        style={{
          flex: 1,
          marginHorizontal: 22,
          marginTop: selfProfile ? 20 : 0,
        }}
      >
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
              case "third":
                return (
                  <ContactInfoRoute
                    selfProfile={selfProfile}
                    contactInfo={contactInfo}
                    setContactInfo={setContactInfo}
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
          <View
            style={{
              top:
                Platform.OS == "ios"
                  ? 0.03 * screenHeight
                  : -0.05 * screenHeight,
            }}
          >
            <Listing
              key={selectedListing.ListingId}
              item={selectedListing}
              LikeStates={LikeStates}
              handleLikePress={handleLikePress}
              numItems={selectedListing.images.length}
              userLocation={userLocation}
              origin={"profile"}
              removeListing={(listingId) => {
                setProfileInfo((prevProfileInfo) => ({
                  ...prevProfileInfo,
                  likedListings: prevProfileInfo.likedListings.filter(
                    (item) => item.ListingId !== listingId
                  ),
                  userListings: prevProfileInfo.userListings.filter(
                    (item) => item.ListingId !== listingId
                  ),
                }));

                setSelectedListing(null);
              }}
            />
          </View>
          <TouchableOpacity
            onPress={() => setSelectedListing(null)}
            style={{ ...styles.button, bottom: "4%" }}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  contactInfoContainer: {
    flexDirection: "column",
    paddingVertical: 20,
  },
  socialIcons: {
    flexDirection: "row",
    paddingVertical: 5,
    alignContent: "center",
    paddingHorizontal: 10,
    textAlign: "center",
  },
  socialText: {
    marginVertical: 1.5,
    marginHorizontal: 10,
    fontWeight: "bold",
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
  },
  noListingsText: {
    textAlign: "center",
    marginTop: 110,
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 20,
    color: Colors.BB_darkRedPurple,
  },
  button: {
    width: 110,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.BB_darkRedPurple,
    borderRadius: 10,
    marginHorizontal: 10,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  buttonText: {
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
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 1,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  circleContainer: {
    top: 15,
    left: 15,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white", // Set the background color as needed
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "black", // Set the border color as needed
  },
});

export default memo(ProfileScreen);
