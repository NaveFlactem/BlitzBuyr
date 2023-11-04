import { serverIp } from "../config.js";
import React, { useEffect, useRef, useState, memo } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator, // Added for loading indicator
} from "react-native";
import NetInfo from "@react-native-community/netinfo"; // Import NetInfo
import { useIsFocused } from "@react-navigation/native";
import Swiper from "react-native-swiper";
import BottomBar from "../components/BottomBar";
import TopBar from "../components/TopBar";
import Colors from "../constants/Colors";
import { Image } from "expo-image";
import * as SecureStore from "expo-secure-store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import noWifi from "../components/noWifi";
import noListings from "../components/noListings";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const HomeScreen = ({ route }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [listings, setListings] = useState([]);
  const [images, setImages] = useState([]);
  const [swipeIndex, setSwipeIndex] = useState(0);
  const didMount = useRef(false);
  const isFocused = useIsFocused();
  const swiperRef = useRef(null);
  const [starStates, setStarStates] = useState({});
  const [networkConnected, setNetworkConnected] = useState(true); // Add network connectivity state
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetworkConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const onRefresh = React.useCallback(() => {
    console.log("refreshing...");
    setRefreshing(true);
    fetchListings();
  }, []);

  const fetchListings = async () => {
    console.log("Fetching listings...");
    if (route.params?.refresh) route.params.refresh = false;
    try {
      const listingsResponse = await fetch(
        `${serverIp}/api/listings?username=${encodeURIComponent(
          await SecureStore.getItemAsync("username")
        )}`,
        {
          method: "GET",
        }
      );

      if (listingsResponse.status <= 201) {
        const listingsData = await listingsResponse.json();
        const initialStarStates = Object.fromEntries(
          listingsData.map((listing) => [listing.ListingId, listing.liked])
        );

        setStarStates(initialStarStates);
        setListings(listingsData);
        console.log("Listings fetched successfully");
      } else {
        console.log("Error fetching listings:", listingsResponse.status);
      }
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // This will run on mount
  useEffect(() => {
    fetchListings();
  }, []);

  // This will run with refresh = true
  useEffect(() => {
    if (route.params?.refresh) {
      setRefreshing(true);
      fetchListings();
    }
  }, [route.params]);

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

  if (isLoading) {
    return (
      <SafeAreaView style={styles.screenfield}>
        <TopBar />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.BB_pink} />
        </View>
        <BottomBar />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screenfield}>
      <TopBar />
      {networkConnected ? (
        listings && listings.length > 0 ? (
          <View style={styles.container}>
            <Swiper
              ref={swiperRef}
              loop={false}
              horizontal={false}
              showsPagination={false}
              showsButtons={false}
              refreshControl={
                <RefreshControl
                  progressViewOffset={100}
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
            >
              {listings.map((item, listIndex) => {
                Image.prefetch(item.images);
                return (
                  <View key={item.ListingId} style={styles.card}>
                    <Swiper
                      loop={false}
                      horizontal={true}
                      showsButtons={false}
                      showsPagination={false}
                    >
                      {item.images.map((imageURI, index) => {
                        return (
                          <View key={index}>
                            <Image
                              style={styles.image}
                              source={{
                                uri: `${serverIp}/img/${imageURI}`,
                              }}
                              placeholder={blurhash}
                              contentFit="contain"
                              transition={200}
                            />
                            <View style={styles.buttonContainer}>
                              <TouchableOpacity
                                style={styles.starButton}
                                activeOpacity={1} // Disable the opacity change on touch
                                onPress={() => handleStarPress(item.ListingId)}
                              >
                                {starStates[item.ListingId] ? (
                                  <MaterialCommunityIcons
                                    name="heart"
                                    size={30}
                                    color="red"
                                  />
                                ) : (
                                  <MaterialCommunityIcons
                                    name="heart-outline"
                                    size={30}
                                    color="black"
                                  />
                                )}
                              </TouchableOpacity>
                            </View>
                            <View style={styles.titleContainer}>
                              <Text style={styles.title}>{item.Title}</Text>
                              <Text
                                style={styles.price}
                              >{`$${item.Price}`}</Text>
                              {item.Description.length > 0 && (
                                <Text style={styles.description}>
                                  {item.Description}
                                </Text>
                              )}
                            </View>
                            <View style={styles.pageContainer}>
                              <Text style={styles.title}>{`${index + 1}/${
                                item.images.length
                              }`}</Text>
                            </View>
                          </View>
                        );
                      })}
                    </Swiper>
                  </View>
                );
              })}
            </Swiper>
          </View>
        ) : (
          noListings()
        )
      ) : (
        noWifi()
      )}
      <BottomBar />
    </SafeAreaView>
  );
};

export default memo(HomeScreen);

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

//////////////////////////////////////////////////////////////////////////////////////
const styles = StyleSheet.create({
  screenfield: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  refresh: {
    top: "40%",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: -1,
    backgroundColor: Colors.BB_pink,
  },
  card: {
    backgroundColor: Colors.BB_darkRedPurple,
    width: "100%",
    height: "81%",
    borderRadius: 0,
    alignItems: "center",
    justifyContent: "center",
    top: "9%",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 0,
  },
  titleContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 5,
    borderRadius: 5,
  },
  pageContainer: {
    position: "absolute",
    bottom: 10,
    left: 380,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 5,
    borderRadius: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  price: {
    fontSize: 14,
    color: "white",
  },
  description: {
    fontSize: 10,
    color: "white",
  },
  starContainer: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  buttonContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  starButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});
