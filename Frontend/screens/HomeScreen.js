import NetInfo from '@react-native-community/netinfo';
import * as SecureStore from 'expo-secure-store';
import { debounce } from 'lodash';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import LocationSlider from '../components/LocationSlider.js';
import NoListings from '../components/noListings';
import NoWifi from '../components/noWifi';
import AndroidSwiperComponent from '../components/swipers/AndroidSwiperComponent.js';
import IOSSwiperComponent from '../components/swipers/IOSSwiperComponent.js';
import TagDrawer from '../components/TagDrawer.js';
import TopBar from '../components/TopBarHome.js';
import BouncePulse from '../components/visuals/BouncePulse.js';
import { serverIp } from '../config.js';
import Colors from '../constants/Colors';
import {
  conditionOptions,
  tagOptions,
  transactionOptions,
} from '../constants/ListingData.js';
import { screenHeight, screenWidth } from '../constants/ScreenDimensions.js';
import {
  calculateTimeSince,
  getLocationWithRetry,
} from '../constants/Utilities';
import * as Settings from '../hooks/UserSettings.js';

const HomeScreen = ({ route }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [listings, setListings] = useState([]);
  const swiperRef = useRef(null);
  const [networkConnected, setNetworkConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [tagsData, setTagsData] = useState([...tagOptions]);
  const [conditions, setConditionsData] = useState([...conditionOptions]);
  const [transactions, setTransactionsData] = useState([...transactionOptions]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const translateX = useSharedValue(-screenWidth);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [distance, setDistance] = useState(30);

  useEffect(() => {
    const fetchDistance = async () => {
      const initialDistance = await Settings.getDistance();
      console.log('Initial distance:', initialDistance);
      setDistance(initialDistance);
    };

    fetchDistance();
  }, []);

  const X_OFFSET_THRESHOLD = 10; // You can adjust this value as needed

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
      if (Platform.OS === 'android') {
        context.hasMovedPastThreshold = false;
      }
    },
    onActive: (event, context) => {
      if (Platform.OS === 'android' && !context.hasMovedPastThreshold) {
        if (Math.abs(event.translationX) > X_OFFSET_THRESHOLD) {
          context.hasMovedPastThreshold = true;
        }
        return; // Early return until threshold is passed
      }

      if (event.translationX < 0) {
        // Detect left swipe
        translateX.value = Math.max(
          -screenWidth,
          context.startX + event.translationX
        );
      }
    },
    onEnd: (_, context) => {
      if (Platform.OS === 'android' && !context.hasMovedPastThreshold) {
        return; // Do nothing if the threshold was not passed
      }

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
      console.error('Error getting location:', error);
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

  handleConditionPress = (index) => {
    //update selectedConditions state
    const newConditionsData = conditions.map((condition, idx) => {
      if (idx === index) {
        return { ...condition, selected: !condition.selected };
      }
      return condition;
    });

    // Update the selectedConditions state
    const pressedConditionName = newConditionsData[index].name;
    const isAlreadySelected = selectedConditions.includes(pressedConditionName);
    let newSelectedConditions;
    if (isAlreadySelected) {
      newSelectedConditions = selectedConditions.filter(
        (conditionName) => conditionName !== pressedConditionName
      );
    } else {
      newSelectedConditions = [...selectedConditions, pressedConditionName];
    }

    setConditionsData(newConditionsData);
    setSelectedConditions(newSelectedConditions);
    console.log(selectedConditions);
  };

  handleTransactionPress = (index) => {
    //update selectedTransactions state
    const newTransactionsData = transactions.map((transaction, idx) => {
      if (idx === index) {
        return { ...transaction, selected: !transaction.selected };
      }
      return transaction;
    });

    // Update the selectedTransactions state
    const pressedTransactionName = newTransactionsData[index].name;
    const isAlreadySelected = selectedTransactions.includes(
      pressedTransactionName
    );
    let newSelectedTransactions;
    if (isAlreadySelected) {
      newSelectedTransactions = selectedTransactions.filter(
        (transactionName) => transactionName !== pressedTransactionName
      );
    } else {
      newSelectedTransactions = [
        ...selectedTransactions,
        pressedTransactionName,
      ];
    }

    setTransactionsData(newTransactionsData);
    setSelectedTransactions(newSelectedTransactions);
    console.log(selectedTransactions);
  };

  const fetchListings = useCallback(async () => {
    console.log('Fetching listings...');
    console.log('Tags:', selectedTags);
    console.log('Distance:', distance < 510 ? distance : 'No Limit');
    if (route.params?.refresh) route.params.refresh = false;

    try {
      const { latitude, longitude } = userLocation;
      const mergedTags = '&tags[]=' + selectedTags.join('&tags[]=');
      console.log('User Location:', userLocation);
      console.log('Latitude:', latitude);
      console.log('Longitude:', longitude);
      console.log('Tags:', mergedTags);
      const username = encodeURIComponent(
        await SecureStore.getItemAsync('username')
      );
      let fetchUrl = `${serverIp}/api/listings?username=${username}&latitude=${latitude}&longitude=${longitude}`;
      if (distance < 510) fetchUrl += `&distance=${distance}`; // don't add distance on unlimited
      if (selectedTags.length > 0) fetchUrl += `&${mergedTags}`;
      console.log(fetchUrl);
      const listingsResponse = await fetch(fetchUrl, {
        method: 'GET',
      });

      if (listingsResponse.status <= 201) {
        const listingsData = await listingsResponse.json();
        setListings(
          listingsData.map((listing) => {
            const timeSince = calculateTimeSince(listing.PostDate);
            return {
              ...listing,
              TimeSince: timeSince,
            };
          })
        );
        console.log('Listings fetched successfully');
      } else {
        console.log('Error fetching listings:', listingsResponse.status);
      }
    } catch (err) {
      console.log('Error:', err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
      swiperRef.current?.scrollTo(0);
      setHoldStateOfRefresh(false);
      setScrollY(0);
    }
  }, [userLocation]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetworkConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const [isLocationSliderVisible, setIsLocationSliderVisible] = useState(false);
  const locationSliderHeight = useSharedValue(-300); // Start off-screen

  const handleLocationPress = () => {
    if (isLocationSliderVisible) {
      locationSliderHeight.value = withTiming(-300); // Hide slider
      setIsLocationSliderVisible(false);
      fetchListings();
    } else {
      locationSliderHeight.value = withTiming(0); // Show slider
      setIsLocationSliderVisible(true);
    }
  };

  const locationSliderStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: locationSliderHeight.value }],
      bottom: 0.085 * screenHeight,
    };
  });

  const onSwipeUpLocationSlider = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startY = locationSliderHeight.value;
    },
    onActive: (event, context) => {
      if (event.translationY < 0) {
        // Detect swipe up
        let newLocationSliderHeight = context.startY + event.translationY;
        locationSliderHeight.value = Math.max(newLocationSliderHeight, -300);
      }
    },
    onEnd: (_) => {
      const shouldClose = locationSliderHeight.value < -20; // Halfway point
      locationSliderHeight.value = withTiming(shouldClose ? -300 : 0, {
        duration: 300,
      });
      runOnJS(setIsLocationSliderVisible)(!shouldClose);
    },
  });

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
    fetchListings();
  };

  const [scrollY, setScrollY] = useState(0);
  const [isHoldStateOfRefresh, setHoldStateOfRefresh] = useState(false);

  const refreshThreshold = -100; // Adjust this threshold

  useEffect(() => {
    if (scrollY <= refreshThreshold && !refreshing) {
      setRefreshing(true);
    }
    if (isHoldStateOfRefresh) {
      setScrollY(-60.5);
    }
  }, [scrollY, refreshing]);

  useEffect(() => {
    if (scrollY > 0) {
      setScrollY(0);
    }
  });

  const calculateOpacity = () => {
    if (scrollY === 0 || scrollY === undefined) {
      return 0;
    }
    let opacity = -scrollY / 100; // Adjust 100 to control the fade speed
    opacity = Math.max(0, Math.min(opacity, 1)); // Clamp between 0 and 1
    return opacity;
  };

  const onRefresh = React.useCallback(() => {
    console.log('refreshing...');
    setRefreshing(true);
    if (userLocation) debouncedFetchListings();
    else getUserLocation();
  }, []);

  useEffect(() => {
    console.log(`Refreshing: ${refreshing}, ScrollY: ${scrollY}`);
  }, [refreshing, scrollY]);

  const debouncedFetchListings = useCallback(
    debounce(() => {
      setHoldStateOfRefresh(true);
      fetchListings();
    }, 1000),
    []
  ); // Adjust debounce time as needed

  useEffect(() => {
    if (scrollY <= refreshThreshold && !refreshing) {
      setRefreshing(true);
      debouncedFetchListings();
    }
  }, [scrollY, refreshing, debouncedFetchListings]);

  const LoadingView = memo(() => (
    <View style={styles.loadingContainer}>
      <BouncePulse />
    </View>
  ));

  if (isLoading) {
    return (
      <SafeAreaView style={styles.screenfield}>
        <TopBar
          handleMenuPress={toggleTagDrawer}
          handleLocationPress={handleLocationPress}
        />
        <LoadingView />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screenfield}>
      <TopBar
        handleMenuPress={toggleTagDrawer}
        handleLocationPress={handleLocationPress}
      />

      <View
        style={styles.topTap}
        onStartShouldSetResponder={() => true}
        onResponderRelease={() => {
          if (swiperRef.current != null) {
            swiperRef.current.scrollTo(0);
          }
        }}
      />

      {Platform.OS === 'ios' && (
        <BouncePulse opacity={refreshing ? 1 : calculateOpacity()} />
      )}
      {networkConnected ? (
        listings && listings.length > 0 ? (
          Platform.OS === 'ios' ? (
            <View style={styles.swiperContainer}>
              <IOSSwiperComponent
                listings={listings}
                userLocation={userLocation}
                removeListing={(listingId) => {
                  setListings((prevListings) =>
                    prevListings.filter((item) => item.ListingId !== listingId)
                  );
                }}
                onScroll={(event) => {
                  const y = event.nativeEvent.contentOffset.y;
                  setScrollY(y);
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor="transparent"
                    colors="transparent"
                    titleColor="transparent"
                    progressViewOffset={50}
                  />
                }
              />
              </View>
          ) : (
            <View style={styles.swiperContainer}>
              <AndroidSwiperComponent
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
                    progressViewOffset={60}
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
              position: 'absolute',
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
            conditions={conditions}
            handleConditionPress={handleConditionPress}
            transactions={transactions}
            handleTransactionPress={handleTransactionPress}
            fetchListings={fetchListings}
            handleMenuPress={toggleTagDrawer}
            isDrawerOpen={isDrawerOpen}
          />
        </Animated.View>
      </PanGestureHandler>

      <PanGestureHandler onGestureEvent={onSwipeAreaGestureEvent}>
        <Animated.View style={styles.swipeArea} />
      </PanGestureHandler>

      {isLocationSliderVisible && (
        <TouchableOpacity
          style={styles.sliderCover}
          onPress={handleLocationPress}
        />
      )}

      <PanGestureHandler onGestureEvent={onSwipeUpLocationSlider}>
        <Animated.View style={locationSliderStyle}>
          <LocationSlider setDistance={setDistance} />
        </Animated.View>
      </PanGestureHandler>
    </SafeAreaView>
  );
};

export default HomeScreen;

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
    position: 'absolute',
    top: 0.08 * screenHeight,
    width: screenWidth,
    height: 0.05 * screenHeight,
    zIndex: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.BB_pink,
  },
  swipeArea: {
    position: 'absolute',
    width: 0.05 * screenWidth,
    height: screenHeight,
    left: 0,
    zIndex: 200,
  },
  sliderCover: {
    flex: 1,
    height: screenHeight,
    width: screenWidth,
    position: 'absolute',
  },
});
