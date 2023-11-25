import NetInfo from '@react-native-community/netinfo';
import * as SecureStore from 'expo-secure-store';
import { debounce } from 'lodash';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  Platform,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import LocationSlider from '../components/LocationSlider';
import NoListings from '../components/noListings';
import NoWifi from '../components/noWifi';
import AndroidSwiperComponent from '../components/swipers/AndroidSwiperComponent.js';
import IOSSwiperComponent from '../components/swipers/IOSSwiperComponent.js';
import TagDrawer, { SwipeArea } from '../components/TagDrawer.js';
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
import { CustomRefreshControl } from '../components/visuals/CustomRefreshControl';

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
  const [isLocationSliderVisible, setIsLocationSliderVisible] = useState(false);
  const locationSliderHeight = useSharedValue(-100); // Start off-screen
  
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
  
  const handleLocationPress = () => {
    if (isLocationSliderVisible) {
      locationSliderHeight.value = withTiming(-100, { duration: 100 }); // Hide slider
      setIsLocationSliderVisible(false);
      fetchListings();
    } else {
      locationSliderHeight.value = withTiming(0, { duration: 100 }); // Show slider
      setIsLocationSliderVisible(true);
    }
  };
  
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

  retryButtonHandler = () => {
    setRefreshing(true);
    fetchListings();
  };
  
  let scrollY = useSharedValue(0);
  const onScroll = (event) => {
    scrollY.value = event.nativeEvent.contentOffset.y;
    console.log ('scrollY:', scrollY.value);
  };

  const onRefresh = React.useCallback(() => {
    console.log('refreshing...');
    setRefreshing(true);
    if (userLocation) fetchListings();
    else getUserLocation();
  }, []);

  const debouncedFetchListings = useCallback(
    debounce(() => {
      fetchListings();
    }, 1000),
    []
    ); 
    
    const fetchListings = useCallback(async () => {
      console.log('Fetching listings...');
      console.log('Tags:', selectedTags);
      console.log('Distance:', distance < 510 ? distance : 'No Limit');
      if (route.params?.refresh) route.params.refresh = false;
      
      try {
        const { latitude, longitude } = userLocation;
        const mergedTags = '&tags[]=' + selectedTags.join('&tags[]=');
        const mergedConditions =
        '&conditions[]=' + selectedConditions.join('&conditions[]=');
      const mergedTransactions =
        '&transactions[]=' + selectedTransactions.join('&transactions[]=');
      console.log('User Location:', userLocation);
      console.log('Latitude:', latitude);
      console.log('Longitude:', longitude);
      console.log('Tags:', mergedTags);
      console.log('Conditions:', mergedConditions);
      console.log('Transactions:', mergedTransactions);

      const username = encodeURIComponent(
        await SecureStore.getItemAsync('username')
      );
      let fetchUrl = `${serverIp}/api/listings?username=${username}&latitude=${latitude}&longitude=${longitude}`;
      if (distance < 510) fetchUrl += `&distance=${distance}`; // don't add distance on unlimited
      if (selectedTags.length > 0) fetchUrl += `&${mergedTags}`;
      if (selectedTransactions.length > 0) fetchUrl += `&${mergedTransactions}`;
      if (selectedConditions.length > 0) fetchUrl += `&${mergedConditions}`;
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
      if (swiperRef.current) {
        swiperRef.current.scrollToOffset({ animated: true, offset: 0 });
      }
      scrollY = 0;
    }
  }, [
    userLocation,
    selectedTags,
    selectedTransactions,
    selectedConditions,
    distance,
    refreshing,
  ]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetworkConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchDistance = async () => {
      const initialDistance = await Settings.getDistance();
      console.log('Initial distance:', initialDistance);
      setDistance(initialDistance);
    };

    fetchDistance();
  }, []);

  // This will run on mount
  useEffect(() => {
    getUserLocation();
  }, []);

  // this will run after you have location
  useEffect(() => {
    if (userLocation) fetchListings();
  }, [userLocation]);

  useEffect(() => {
    if (userLocation && !isDrawerOpen) fetchListings();
  }, [isDrawerOpen]);

  // This will run with refresh = true
  useEffect(() => {
    if (route.params?.refresh) {
      setRefreshing(true);
      if (userLocation) fetchListings();
      else getUserLocation();
    }
  }, [route.params]);

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
          if (swiperRef.current) {
            swiperRef.current.scrollToOffset({ animated: true, offset: 0 });
        }
        }}
      />

      {networkConnected ? (
        listings && listings.length > 0 ? (
          Platform.OS === 'ios' ? (
            <View style={styles.swiperContainer}>
              <IOSSwiperComponent
                swiperRef={swiperRef}
                listings={listings}
                userLocation={userLocation}
                removeListing={(listingId) => {
                  setListings((prevListings) =>
                    prevListings.filter((item) => item.ListingId !== listingId)
                  );
                }}
                onScroll={onScroll}
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
                swiperRef={swiperRef}
                listings={listings}
                userLocation={userLocation}
                removeListing={(listingId) => {
                  setListings((prevListings) =>
                    prevListings.filter((item) => item.ListingId !== listingId)
                  );
                }}
                onScroll={onScroll}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    progressViewOffset={50}
                    progressBackgroundColor={'transparent'}
                    colors={['transparent']}
                    style={{ backgroundColor: 'transparent' }}
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

      <TagDrawer
        tagsData={tagsData}
        conditions={conditions}
        transactions={transactions}
        setTagsData={setTagsData}
        setConditionsData={setConditionsData}
        setTransactionsData={setTransactionsData}
        selectedTags={selectedTags}
        selectedConditions={selectedConditions}
        selectedTransactions={selectedTransactions}
        setSelectedTags={setSelectedTags}
        setSelectedConditions={setSelectedConditions}
        setSelectedTransactions={setSelectedTransactions}
        fetchListings={fetchListings}
        handleMenuPress={toggleTagDrawer}
        setIsDrawerOpen={setIsDrawerOpen}
        isDrawerOpen={isDrawerOpen}
        translateX={translateX}
      />

      <SwipeArea
        handleSwipe={toggleTagDrawer}
        translateX={translateX}
        setIsDrawerOpen={setIsDrawerOpen}
        isDrawerOpen={isDrawerOpen}
      />

      {isLocationSliderVisible && (
        <TouchableOpacity
          style={styles.sliderCover}
          onPress={handleLocationPress}
        />
      )}

      <LocationSlider
        setDistance={setDistance}
        isLocationSliderVisible={isLocationSliderVisible}
        setIsLocationSliderVisible={setIsLocationSliderVisible}
        locationSliderHeight={locationSliderHeight}
      />

      <CustomRefreshControl refreshing={refreshing} scrollY={scrollY} />
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
  sliderCover: {
    flex: 1,
    height: screenHeight,
    width: screenWidth,
    position: 'absolute',
  },
});
