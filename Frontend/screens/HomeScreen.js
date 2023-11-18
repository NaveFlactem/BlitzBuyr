import { serverIp } from "../config.js";
import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import Swiper from "react-native-swiper";
import TopBar from "../components/TopBarHome.js";
import Colors from "../constants/Colors";
import { Image } from "expo-image";
import * as SecureStore from "expo-secure-store";
import noWifi from "../components/noWifi";
import noListings from "../components/noListings";
import Listing from "../components/Listing.js";
import useBackButtonHandler from "../hooks/DisableBackButton.js";
import BouncePulse from "../components/BouncePulse.js";
import * as Location from "expo-location";

const IOSSwiperComponent = memo(({ swiperRef, listings, removeListing, userLocation }) => {
  return (
    <Swiper
      ref={swiperRef}
      loop={false}
      horizontal={false}
      showsPagination={false}
      showsButtons={false}
    >
      {listings.map((item) => (
        <Listing
          key={item.ListingId}
          item={item}
          removeListing={removeListing}
          userLocation={userLocation}
        />
      ))}
    </Swiper>
  );
});

const AndroidSwiperComponent = memo(
  ({ swiperRef, listings, refreshControl, removeListing, userLocation }) => {
    return (
      <Swiper
        ref={swiperRef}
        loop={false}
        horizontal={false}
        showsPagination={false}
        showsButtons={false}
        refreshControl={refreshControl}
      >
        {listings.map((item, listIndex) => {
          Image.prefetch(item.images);
          return (
            <Listing
              key={item.ListingId}
              item={item}
              removeListing={removeListing}
              userLocation={userLocation}
            />
          );
        })}
      </Swiper>
    );
  }
);

const HomeScreen = ({ route }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [listings, setListings] = useState([]);
  const swiperRef = useRef(null);
  const [networkConnected, setNetworkConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  const [userLocation, setUserLocation] = useState(null);
  const scrollViewRef = useRef(null);

  const getUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      console.error("Location permission not granted");
      // FIXME: Handle location permission not granted
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    setUserLocation({ latitude: latitude, longitude: longitude });
  };

  const fetchListings = async () => {
    console.log("Fetching listings...");
    if (route.params?.refresh) route.params.refresh = false;

    try {
      // Get the device's location
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.error("Location permission not granted");
        // Handle location permission not granted
        return;
      }

      const { latitude, longitude } = userLocation;
      console.log("User Location:", userLocation);
      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);
      const listingsResponse = await fetch(
        `${serverIp}/api/listings?username=${encodeURIComponent(
          await SecureStore.getItemAsync("username")
        )}&latitude=${latitude}&longitude=${longitude}&distance=${1}`, // FIXME: Consider encrypting this data. This 1 value needs to be determined by the UI slider
        {
          method: "GET",
        }
      );

      if (listingsResponse.status <= 201) {
        const listingsData = await listingsResponse.json();

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

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetworkConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // This will run on mount
  useEffect(() => {
    getUserLocation();
  }, []);

  // this will run after you have location
  useEffect(() => {
    if (userLocation) fetchListings();
  }, [userLocation]);

  // This will run with refresh = true
  useEffect(() => {
    if (route.params?.refresh) {
      setRefreshing(true);
      if (userLocation) fetchListings();
      else getUserLocation();
    }
  }, [route.params]);

  const onRefresh = React.useCallback(() => {
    console.log("refreshing...");
    setRefreshing(true);
    fetchListings();
  }, []);

  const handleScroll = (event) => {
    // Update the scroll position state
    setScrollPosition(event.nativeEvent.contentOffset);
  };

  const restoreScrollPosition = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(scrollPosition);
    }
  };

  useEffect(() => {
    restoreScrollPosition();
  }, []);

  const LoadingView = memo(() => (
    <View style={styles.loadingContainer}>
      <BouncePulse />
    </View>
  ));

  if (isLoading) {
    return (
      <SafeAreaView style={styles.screenfield}>
        <TopBar />
        <LoadingView />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screenfield}>
      <TopBar />

      <View
        style={styles.topTap}
        onStartShouldSetResponder={() => true}
        onResponderRelease={() => {
          swiperRef.current.scrollTo(0);
        }}
      />

      {networkConnected ? (
        listings && listings.length > 0 ? (
          Platform.OS === "ios" ? (
            <ScrollView
              ref={scrollViewRef}
              onScroll={handleScroll} //doesn't work
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  progressViewOffset={50}
                />
              }
              scrollEventThrottle={16}
              scrollEnabled={Platform.OS === "ios" ? true : false}
            >
              <View style={styles.swiperContainer}>
                <IOSSwiperComponent
                  swiperRef={swiperRef}
                  listings={listings}
                  userLocation={userLocation}
                  removeListing={(listingId) => {
                    setListings((prevListings) =>
                      prevListings.filter(
                        (item) => item.ListingId !== listingId
                      )
                    );
                  }}
                />
              </View>
            </ScrollView>
          ) : (
            <View style={styles.swiperContainer}>
              <AndroidSwiperComponent
                swiperRef={swiperRef}
                listings={listings}
                userLocation={userLocation}
                removeListing={(listingId) => {
                  setListings((prevListings) =>
                    prevListings.filter((item) => item.ListingId !== listingId)
                  );
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    progressViewOffset={50}
                  />
                }
              />
            </View>
          )
        ) : (
          noListings()
        )
      ) : (
        noWifi()
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

//////////////////////////////////////////////////////////////////////////////////////
const styles = StyleSheet.create({
  screenfield: {
    flex: 1,
    backgroundColor: Colors.BB_pink,
  },
  swiperContainer: {
    height: screenHeight,
    width: screenWidth,
  },
  topTap: {
    position: "absolute",
    top: 0.08 * screenHeight,
    width: screenWidth,
    height: 0.05 * screenHeight,
    zIndex: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
});
