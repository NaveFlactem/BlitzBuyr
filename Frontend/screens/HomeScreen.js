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
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useAnimatedGestureHandler
} from "react-native-reanimated";
import Swiper from "react-native-swiper";
import Colors from "../constants/Colors";
import { Image } from "expo-image";
import * as SecureStore from "expo-secure-store";
import noWifi from "../components/noWifi";
import noListings from "../components/noListings";
import Listing from "../components/Listing.js";
import useBackButtonHandler from "../hooks/DisableBackButton.js";
import BouncePulse from "../components/BouncePulse.js";
import { PanGestureHandler } from "react-native-gesture-handler";

const IOSSwiperComponent = memo(({ swiperRef, listings }) => {
  return (
    <Swiper
      ref={swiperRef}
      loop={false}
      horizontal={false}
      showsPagination={false}
      showsButtons={false}
    >
      {listings.map((item) => (
        <Listing key={item.ListingId} item={item} />
      ))}
    </Swiper>
  );
});

const AndroidSwiperComponent = memo(
  ({ swiperRef, listings, refreshControl }) => {
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
          return <Listing key={item.ListingId} item={item} />;
        })}
      </Swiper>
    );
  }
);

const TagDrawer = memo(({ tags, handleTagPress, filterListings }) => { 
  return(
      <View style={styles.drawerContainer}>
        <ScrollView style={styles.drawerScroll}>
          <View style={styles.drawer}>
            <TouchableOpacity style={styles.applyButton} onPress={filterListings}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          {tags.map((tag, tagIndex) => (
                      <TouchableOpacity
                        key={tagIndex}
                        style={styles.tagContainer}
                        onPress={() => {
                          handleTagPress(tagIndex);
                        }}
                      >
                        <View
                          style={[
                            styles.tagSelected,
                            { opacity: tag.selected ? 1 : 0.3 },
                          ]}
                        />
                        <View
                          style={[
                            styles.rhombus,
                            { opacity: tag.selected ? 0.15 : 0 },
                          ]}
                        />
                        <Text style={styles.tagText}>{tag.name}</Text>
                      </TouchableOpacity>
                    ))}

                    <View style={styles.spacer} />
          </View>
        </ScrollView>
      </View>
        )
});


const TopBar = memo(({ handleMenuPress }) => {
  

  

  return (
    <View style={styles.topBar}>
      <TouchableOpacity style={styles.menu} onPress={handleMenuPress}>
        <MaterialCommunityIcons name="menu" size={30} color={Colors.BB_bone} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.location}>
        <MaterialCommunityIcons
          name="map-marker"
          size={30}
          color={Colors.BB_bone}
        />
      </TouchableOpacity>
      <Image
        style={styles.logo}
        source={require("../assets/blitzbuyr_name_logo.png")}
      />
      {/* <View style={styles.locationslide}>
      <LocationSlider />
    </View> */}
      
    </View>
  );
});


const HomeScreen = ({ route }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [listings, setListings] = useState([]);
  const swiperRef = useRef(null);
  const [networkConnected, setNetworkConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
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
  const drawerOpen = useSharedValue(false);
  const drawerPosition = useSharedValue(-screenWidth);
  const [tags, setTags] = useState(tagsData);
  const translateX = useSharedValue(0);

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
    },
    onEnd: () => {
      if (translateX.value > screenWidth / 2) {
        // Close drawer
        translateX.value = withTiming(-screenWidth);
      } else {
        // Open drawer
        translateX.value = withTiming(0);
      }
    },
  });


  const toggleTagDrawer = () => {
    drawerOpen.value = !drawerOpen.value;
    drawerPosition.value = withTiming(drawerOpen.value ? 0 : -screenWidth, {
      duration: 300,
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetworkConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

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
      newSelectedTags = selectedTags.filter(tagName => tagName !== pressedTagName);
    } else {
      newSelectedTags = [...selectedTags, pressedTagName];
    }

    setTagsData(newTagsData);
    setSelectedTags(newSelectedTags);
    console.log(selectedTags);
  };

  const filterListings = async () => {
    console.log("Filtering listings...");
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
      console.log("e");
      setRefreshing(true);
      fetchListings();
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
      <TopBar handleMenuPress={toggleTagDrawer}/>


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
                <IOSSwiperComponent swiperRef={swiperRef} listings={listings} />
              </View>
            </ScrollView>
          ) : (
            <View style={styles.swiperContainer}>
              <AndroidSwiperComponent
                swiperRef={swiperRef}
                listings={listings}
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
      <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View
        style={[
          {
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: screenWidth,
            flex: 110,
          },
          animatedStyle,
        ]}
      >
        <TagDrawer tags={tagsData} handleTagPress={handleTagPress} filterListings={filterListings}/>
      </Animated.View>
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
  logo: {
    height: 0.1 * screenWidth,
    width: 0.55 * screenWidth,
    top: 0.025 * screenHeight,
    right: 0.01 * screenWidth,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
      },
    }),
  },
  menu: {
    position: "absolute",
    height: "auto",
    width: "auto",
    bottom: "8%",
    left: "5%",
    zIndex: 11,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
      },
    }),
  },
  location: {
    position: "absolute",
    height: "auto",
    width: "auto",
    bottom: "8%",
    right: "5%",
    zIndex: 11,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
      },
    }),
  },
  topBar: {
    position: "absolute",
    height: 0.09 * screenHeight,
    width: screenWidth,
    backgroundColor: Colors.BB_darkRedPurple,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 3,
    borderColor:
    Platform.OS == "ios" ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.3)",
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
      },
    }),
    zIndex: 10,
  },
  locationslide: {
    position: "absolute",
    height: "auto",
    width: "auto",
    bottom: "8%",
    right: "20%",
    zIndex: 11,
  },
  drawerContainer: {
    position: 'absolute',
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    height: screenHeight,
    width: screenWidth,
    zIndex: 110,
  },
  drawerScroll: {
    top: 0.08 * screenHeight,
    width: 0.40 * screenWidth,
    left: 0,
    height: screenHeight,
    backgroundColor: Colors.BB_darkRedPurple,
  },
drawer: {
    position: 'absolute',
    alignSelf: 'center',
    left: "5%",
    borderRadius: 20,
    paddingTop: 20,
    height: "auto",
    width: "auto",
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 12,
    backgroundColor: Colors.BB_darkerRedPurple,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
      },
      android: {
        elevation: 10,
      },
    }),
},
tagContainer: {
  marginLeft: 10,
  marginRight: 10,
  marginBottom: 10,
  borderRadius: 20,
  alignContent: "center",
  justifyContent: "center",
  textAlign: "center",
  height: 0.06 * screenHeight,
  width: 0.3 * screenWidth,
  ...Platform.select({
    ios: {
      shadowColor: "white",
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
  }),
},
tagText: {
  color: Colors.white,
  fontSize: 18,
  alignSelf: "center",
  fontWeight: "bold",
  ...Platform.select({
    ios: {
      shadowColor: Colors.black,
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    android: {
      elevation: 10,
    },
  }),
},
rhombus: {
  alignSelf: "center",
  position: "absolute",
  width: 0.04 * screenHeight,
  aspectRatio: 1,
  backgroundColor: Colors.BB_darkPink,
  opacity: 0.15,
  transform: [{ rotate: "45deg" }],
},
tagSelected: {
  alignSelf: "center",
  backgroundColor: Colors.BB_darkRedPurple,
  borderRadius: 20,
  height: "100%",
  width: "100%",
  position: "absolute",
  borderColor: Colors.BB_bone,
  borderWidth: 1,
},
applyButton: {
  borderRadius: 20,
  height: 0.06 * screenHeight,
  width: 0.3 * screenWidth,
  marginBottom: 10,
  alignSelf: "center",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: Colors.BB_pink,
  borderColor: Colors.BB_bone,
  borderWidth: 1,
  ...Platform.select({
    ios: {
      shadowColor: Colors.BB_bone,
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    android: {
      elevation: 10,
    },
  }),
},
applyButtonText: {
  color: Colors.white,
  fontSize: 18,
  fontWeight: "bold",
},
spacer: {
  height: 0.1 * screenHeight,
  width: "100%",
},  
});
