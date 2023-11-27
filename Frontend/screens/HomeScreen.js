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
import { useSharedValue, withTiming } from 'react-native-reanimated';
import LocationSlider from '../components/LocationSlider';
import NoListings from '../components/noListings';
import NoWifi from '../components/noWifi';
import AndroidSwiperComponent from '../components/swipers/AndroidSwiperComponent.js';
import IOSSwiperComponent from '../components/swipers/IOSSwiperComponent.js';
import TagDrawer, { SwipeArea } from '../components/TagDrawer.js';
import TopBar from '../components/TopBarHome.js';
import BouncePulse from '../components/visuals/BouncePulse.js';
import { CustomRefreshControl } from '../components/visuals/CustomRefreshControl';
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
import { useThemeContext } from '../components/visuals/ThemeProvider';
import { getThemedStyles } from '../constants/Styles';
/**
 * @namespace HomeScreenNamespace
 * @description - HomeScreen is the home screen of the application
 * 
 */

/**
 * Home screen component displaying listings and filters.
 * @component
 * @name HomeScreen
 * @memberof HomeScreenNamespace
 * @param {object} route - Information about the current route.
 * @returns {JSX.Element} Home screen UI with listings and filters.
 * @description Renders the home screen displaying listings and various filters. Manages state for refreshing listings, network connectivity, loading state, user location, tag options, condition options, transaction options, selected tags, conditions, and transactions. Uses ref for swiper navigation and shared values for animation. Handles drawer visibility, distance settings, and location slider visibility.
 */
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
  const styles = getThemedStyles(useThemeContext().theme).HomeScreen;

  /**
   * 
   * @function
   * @name toggleTagDrawer
   * @memberof HomeScreenNamespace
   * @returns {void}
   * @description Controls the visibility of the tag drawer by toggling its state between open and closed. If the drawer is currently open, it animates its closure by sliding it to the left. If closed, it animates its opening by sliding it to the right.
   */
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

  /**
   * 
   * @function
   * @name handleLocationPress
   * @memberof HomeScreenNamespace
   * @returns {void}
   * @description Controls the visibility of the location slider by toggling its state between visible and hidden. If the slider is currently visible, it initiates an animation to hide it and fetches listings. If hidden, it triggers an animation to display it.
   */

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

  /**
   * 
   * @function
   * @name handleInnerScrolling
   * @memberof HomeScreenNamespace
   * @param {React.RefObject<ScrollView>} swiperRef - Reference to the swiper ScrollView component.
   * @returns {void}
   * @description Disables scrolling on the swiper component by setting its native property 'scrollEnabled' to 'false'.
   */
  handleInnerScolling = () => {
    swiperRef.current.setNativeProps({ scrollEnabled: false });
  };
  /**
   * 
   * @function
   * @name handleInnerScrollingEnd
   * @memberof HomeScreenNamespace
   * @param {React.RefObject<ScrollView>} swiperRef - Reference to the swiper ScrollView component.
   * @returns {void}
   * @description Enables scrolling on the swiper component by setting its native property 'scrollEnabled' to 'true'.
   */
  handleInnerScollingEnd = () => {
    swiperRef.current.setNativeProps({ scrollEnabled: true });
  };

  /**
   * 
   * @function
   * @name getUserLocation
   * @memberof HomeScreenNamespace
   * @returns {void}
   * @description Retrieves the user's location using `getLocationWithRetry` with retry mechanism. If successful, it extracts the latitude and longitude and sets the user's location in the component state. If an error occurs, it logs the error and requires appropriate error handling.
   * Error processing incomplete
   */
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

  /**
   * Handles the retry action to fetch listings.
   * @function
   * @name retryButtonHandler
   * @memberof HomeScreenNamespace
   * @returns {void}
   * @description Initiates the refreshing state, triggering a fetch of listings data when a retry action is performed. Used typically in response to a failed or interrupted data fetch operation to attempt fetching listings again.
   */
  retryButtonHandler = () => {
    setRefreshing(true);
    fetchListings();
  };

  /**
   * 
   * @function
   * @name onScroll
   * @memberof HomeScreenNamespace
   * @param {Object} event - The scroll event object.
   * @returns {void}
   * @description Updates the shared value `scrollY` with the current vertical scroll position obtained.
   */
  let scrollY = useSharedValue(0);
  const onScroll = (event) => {
    scrollY.value = event.nativeEvent.contentOffset.y;
  };

  /**
   * 
   * @function
   * @name onRefresh
   * @memberof HomeScreenNamespace
   * @returns {void}
   * @description Initiates the refresh action by setting the refreshing state, and if the user location is available, it triggers fetching listings. If the user location is not available, it attempts to retrieve the user's location before fetching listings.
   */
  const onRefresh = React.useCallback(() => {
    console.log('refreshing...');
    setRefreshing(true);
    if (userLocation) fetchListings();
    else getUserLocation();
  }, []);
/**
 * 
 * @function
 * @name debouncedFetchListings
 * @memberof HomeScreenNamespace
 * @returns {Function} - Debounced function
 * @description Creates a version of the `fetchListings` function using the `debounce` utility. This debounced function introduces a delay of 1000 milliseconds before invoking `fetchListings`, ensuring that rapid consecutive calls to `debouncedFetchListings` within the specified delay period will result in a single execution of `fetchListings`.
 */
  const debouncedFetchListings = useCallback(
    debounce(() => {
      fetchListings();
    }, 1000),
    [],
  );

  /**
   * Fetches listings based on selected criteria such as user location, tags, conditions, and transactions.
   * @function
   * @name fetchListings
   * @memberof HomeScreenNamespace
   * @returns {Promise<void>}
   * @description Initiates the process to fetch listings based on selected criteria:
   * - Logs the fetched listings' details, including tags, distance, user location, etc.
   * - Constructs the fetch URL with encoded parameters based on selected criteria.
   * - Performs a GET request to fetch listings from the server.
   * - Parses the response data and updates the listings state.
   * - Calculates and adds a 'TimeSince' property to each listing to denote the time elapsed since posting.
   * - Handles errors during the fetching process.
   * - Updates states for loading and refreshing status after fetching listings.
   * @param {Array} userLocation - User's geographical location coordinates.
   * @param {Array} selectedTags - Selected tags for filtering listings.
   * @param {Array} selectedTransactions - Selected transaction types for filtering listings.
   * @param {Array} selectedConditions - Selected conditions for filtering listings.
   * @param {number} distance - Maximum distance for listing proximity.
   * @param {boolean} refreshing - Current state indicating refreshing status.
   */
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
        await SecureStore.getItemAsync('username'),
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
          }),
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
                    prevListings.filter((item) => item.ListingId !== listingId),
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
                handleInnerScolling={handleInnerScolling}
                handleInnerScollingEnd={handleInnerScollingEnd}
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
                    prevListings.filter((item) => item.ListingId !== listingId),
                  );
                }}
                onScroll={onScroll}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    progressViewOffset={50}
                  />
                }
                handleInnerScolling={handleInnerScolling}
                handleInnerScollingEnd={handleInnerScollingEnd}
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
      {Platform.OS === 'ios' && (
        <CustomRefreshControl
          refreshing={refreshing}
          scrollY={scrollY}
          swiperRef={swiperRef}
        />
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;
