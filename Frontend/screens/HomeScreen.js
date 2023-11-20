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
  TouchableOpacity,
  Text,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useAnimatedGestureHandler,
  runOnJS,
} from "react-native-reanimated";
import Swiper from "react-native-swiper";
import Colors from "../constants/Colors";
import { Image } from "expo-image";
import * as SecureStore from "expo-secure-store";
import NoWifi from "../components/noWifi";
import NoListings from "../components/noListings";
import Listing from "../components/Listing.js";
import BouncePulse from "../components/BouncePulse.js";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { getLocationWithRetry } from "../constants/Utilities";
import TopBar from "../components/TopBarHome.js";
import TagDrawer from "../components/TagDrawer.js";


const IOSSwiperComponent = memo(
  ({ swiperRef, listings, removeListing, userLocation }) => {
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
  }
);

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
  const [tagsData, setTagsData] = useState([
    { name: "Furniture", selected: false },
    { name: "Electronics", selected: false },
    { name: "Clothing", selected: false },
    { name: "Books", selected: false },
    { name: "Appliances", selected: false },
    { name: "Sports", selected: false },
    { name: "Toys", selected: false },
    { name: "Tools", selected: false },
    { name: "Vehicles", selected: false },
    { name: "Service", selected: false },
    { name: "Other", selected: false },
  ]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState(tagsData);
  const translateX = useSharedValue(-screenWidth);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Gesture handler for closing the drawer
  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      if (event.translationX < 0) {
        // Detect left swipe
        translateX.value = Math.max(
          -screenWidth,
          context.startX + event.translationX
        );
      }
    },
    onEnd: (_) => {
      const shouldClose = translateX.value < -screenWidth * 0.65;
      translateX.value = withTiming(
        shouldClose ? -screenWidth : -screenWidth * 0.6,
        { duration: 300 }
      );
      if (shouldClose) {
        runOnJS(setIsDrawerOpen)(false);
      }
    },
  });

  // Gesture handler for opening the drawer
  const onSwipeAreaGestureEvent = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      if (event.translationX > 0) {
        // Detect right swipe
        let newTranslateX = context.startX + event.translationX;
        translateX.value = Math.min(newTranslateX, -screenWidth * 0.6);
      }
    },
    onEnd: (_) => {
      const shouldOpen = translateX.value > -screenWidth * 0.9;
      translateX.value = withTiming(
        shouldOpen ? -screenWidth * 0.6 : -screenWidth,
        { duration: 300 }
      );
      if (shouldOpen) {
        runOnJS(setIsDrawerOpen)(true);
      }
    },
  });

  const toggleTagDrawer = () => {
    if (translateX.value === -screenWidth * 0.6) {
      // Drawer is open, so close it
      translateX.value = withTiming(-screenWidth, {
        duration: 300,
      });
      setIsDrawerOpen(false);
    } else {
      // Drawer is closed, so open it
      translateX.value = withTiming(-screenWidth * 0.6, {
        duration: 300,
      });
      setIsDrawerOpen(true);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

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

  handleTagPress = (index) => {
    // Update the tagsData state
    const newTagsData = tagsData.map((tag, idx) => {
      if (idx === index) {
        return { ...tag, selected: !tag.selected };
      }
      return tag;
    });

    // Update the selectedTags state
    const pressedTagName = newTagsData[index].name;
    const isAlreadySelected = selectedTags.includes(pressedTagName);
    let newSelectedTags;
    if (isAlreadySelected) {
      newSelectedTags = selectedTags.filter(
        (tagName) => tagName !== pressedTagName
      );
    } else {
      newSelectedTags = [...selectedTags, pressedTagName];
    }

    setTagsData(newTagsData);
    setSelectedTags(newSelectedTags);
    console.log(selectedTags);
  };

  const filterListings = async () => {
    console.log("Filtering listings...");
    if (selectedTags.length === 0) return fetchListings();
    
    try {
      //make string tags=[]={index0}&tags=[]={index1}...
      const mergedTags = selectedTags.join("&tags[]=");
      console.log(mergedTags);
      const listingsResponse = await fetch(
        `${serverIp}/api/listings?username=${encodeURIComponent(
          await SecureStore.getItemAsync("username")
        )}&tags[]=${mergedTags}`,
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

  const fetchListings = async () => {
    console.log("Fetching listings...");
    if (route.params?.refresh) route.params.refresh = false;

    try {
      const { latitude, longitude } = userLocation;
      console.log("User Location:", userLocation);
      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);
      const listingsResponse = await fetch(
        `${serverIp}/api/listings?username=${encodeURIComponent(
          await SecureStore.getItemAsync("username")
        )}&latitude=${latitude}&longitude=${longitude}&distance=${100}`, // FIXME: Consider encrypting this data. This 1 value needs to be determined by the UI slider
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

  retryButtonHandler = () => {
    setRefreshing(true);
    if (selectedTags.length > 0) {
      filterListings();
    } else {
      fetchListings();
    }
  };

  const onRefresh = React.useCallback(() => {
    console.log("refreshing...");
    setRefreshing(true);
    if (userLocation) fetchListings();
    else getUserLocation();
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
        <TopBar handleMenuPress={ toggleTagDrawer }/>
        <LoadingView />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screenfield}>
      <TopBar handleMenuPress = {toggleTagDrawer} />

      <View
        style={styles.topTap}
        onStartShouldSetResponder={() => true}
        onResponderRelease={() => {
          if (swiperRef.current != null) {
            swiperRef.current.scrollTo(0);
          }
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
          <NoListings onRetry={retryButtonHandler} />
        )
      ) : (
        <NoWifi onRetry={retryButtonHandler} />
      )}

      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View
          style={[
            {
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 0.45 * screenWidth,
              flex: 110,
            },
            animatedStyle,
          ]}
        >
          <TagDrawer
            tags={tagsData}
            handleTagPress={handleTagPress}
            filterListings={filterListings}
            handleMenuPress={toggleTagDrawer}
            isDrawerOpen={isDrawerOpen}
          />
        </Animated.View>
      </PanGestureHandler>

      <PanGestureHandler onGestureEvent={onSwipeAreaGestureEvent}>
        <Animated.View style={styles.swipeArea} />
      </PanGestureHandler>
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
    backgroundColor: Colors.BB_bone,
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
  swipeArea: {
    position: "absolute",
    width: 0.05 * screenWidth,
    height: screenHeight,
    left: 0,
    zIndex: 200,
  },
});
