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
import Listing from "../components/Listing.tsx";
import { PanGestureHandlerProps } from "react-native-gesture-handler";

const HomeScreen = ({ route }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [listings, setListings] = useState([]);
  const [images, setImages] = useState([]);
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

  const fetchListings = async () => {
    console.log("Fetching listings...");
    if (route.params?.refresh) route.params.refresh = false;
    try {
      const listingsResponse = await fetch(
        `${serverIp}/api/listings?username=${encodeURIComponent(
          await SecureStore.getItemAsync("username"),
        )}`,
        {
          method: "GET",
        },
      );

      if (listingsResponse.status <= 201) {
        const listingsData = await listingsResponse.json();
        const initialStarStates = Object.fromEntries(
          listingsData.map((listing) => [listing.ListingId, listing.liked]),
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
      } listing ID ${listingId}`,
    );
  };

  const onRefresh = React.useCallback(() => {
    console.log("refreshing...");
    setRefreshing(true);
    fetchListings();
  }, []);

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

      <View
        style={styles.topTap}
        onTouchStart={() => {
          swiperRef.current.scrollTo(0);
        }}
      />

      {networkConnected ? (
        listings && listings.length > 0 ? (
          <View style={styles.container}>
            <Swiper
              ref={swiperRef}
              loop={false}
              horizontal={false}
              showsPagination={false}
              showsButtons={false}
            >
              {listings.map((item, listIndex) => {
                Image.prefetch(item.images);
                return (
                  <Listing
                    key={item.ListingId}
                    item={item}
                    starStates={starStates}
                    handleStarPress={handleStarPress}
                    numItems={item.images.length}
                  />
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

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

//////////////////////////////////////////////////////////////////////////////////////
const styles = StyleSheet.create({
  screenfield: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.BB_pink,
  },
  topTap: {
    position: "absolute",
    top: 0.08 * screenHeight,
    width: screenWidth,
    height: 0.05 * screenHeight,
    zIndex: 3,
  },
});
