import NetInfo from '@react-native-community/netinfo';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  Platform,
  RefreshControl,
  SafeAreaView,
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
import { useThemeContext } from '../components/visuals/ThemeProvider';
import {
  conditionOptions,
  currencies,
  tagOptions,
  transactionOptions,
} from '../constants/ListingData.js';
import { screenWidth } from '../constants/ScreenDimensions.js';
import { getThemedStyles } from '../constants/Styles';
import { getLocationWithRetry } from '../constants/Utilities';
import * as Settings from '../hooks/UserSettings.js';
import { fetchListings } from '../network/Service';
import Colors from '../constants/Colors';
/**
 * @namespace HomeScreen
 * @memberof Screens
 * @description - HomeScreen is the home screen of the application
 *
 */

/**
 * Home screen component displaying listings and filters.
 * @component
 * @name HomeScreen
 * @memberof HomeScreen
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
  const [currencyData, setCurrencyData] = useState([...currencies]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const translateX = useSharedValue(-screenWidth);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [distance, setDistance] = useState(30);
  const [isLocationSliderVisible, setIsLocationSliderVisible] = useState(false);
  const locationSliderHeight = useSharedValue(-100); // Start off-screen
  const { theme } = useThemeContext();
  const styles = getThemedStyles(useThemeContext().theme).HomeScreen;

  /**
   *
   * @function
   * @name toggleTagDrawer
   * @memberof HomeScreen
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
   * @memberof HomeScreen
   * @returns {void}
   * @description Controls the visibility of the location slider by toggling its state between visible and hidden. If the slider is currently visible, it initiates an animation to hide it and fetches listings. If hidden, it triggers an animation to display it.
   */

  const handleLocationPress = () => {
    console.log(
      'Location pressed, toggling slider visibility...',
      isLocationSliderVisible,
    );
    if (isLocationSliderVisible) {
      locationSliderHeight.value = withTiming(-100, { duration: 100 }); // Hide slider
      setIsLocationSliderVisible(false);
      fetchListingsAsync();
    } else {
      locationSliderHeight.value = withTiming(0, { duration: 100 }); // Show slider
      setIsLocationSliderVisible(true);
      console.log('location slider', isLocationSliderVisible);
    }
  };

  /**
   *
   * @function
   * @name handleInnerScrolling
   * @memberof HomeScreen
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
   * @memberof HomeScreen
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
   * @memberof HomeScreen
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
   * @memberof HomeScreen
   * @returns {void}
   * @description Initiates the refreshing state, triggering a fetch of listings data when a retry action is performed. Used typically in response to a failed or interrupted data fetch operation to attempt fetching listings again.
   */
  retryButtonHandler = () => {
    setRefreshing(true);
    fetchListingsAsync();
  };

  /**
   *
   * @function
   * @name onScroll
   * @memberof HomeScreen
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
   * @memberof HomeScreen
   * @returns {void}
   * @description Initiates the refresh action by setting the refreshing state, and if the user location is available, it triggers fetching listings. If the user location is not available, it attempts to retrieve the user's location before fetching listings.
   */
  const onRefresh = React.useCallback(() => {
    console.log('refreshing...');
    setRefreshing(true);
    getUserLocation();
  }, [userLocation]);

  /**
   * Asynchronously fetches listings.
   *
   * @function
   * @name fetchListingsAsync
   * @memberof HomeScreen
   * @returns {Function} - Callback function
   * @description
   * Retrieves the listings asynchronously based on the state of the home screen
   *
   * @throws {Error} Throws an error if there is an issue during the fetching process.
   * @async
   * @see {@link fetchListings} - The original function for fetching listings.
   */
  const fetchListingsAsync = useCallback(async () => {
    try {
      await fetchListings(
        userLocation,
        distance,
        selectedTags,
        selectedConditions,
        selectedTransactions,
        selectedCurrency,
        setListings,
        setIsLoading,
        setRefreshing,
      );
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }, [userLocation, distance, selectedTags, selectedConditions]);

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
    if (userLocation) fetchListingsAsync();
  }, [userLocation]);

  useEffect(() => {
    if (userLocation && !isDrawerOpen) fetchListingsAsync();
  }, [isDrawerOpen]);

  // This will run with refresh = true
  useEffect(() => {
    if (route.params?.refresh) {
      setRefreshing(true);
      if (userLocation) fetchListingsAsync();
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
                  <View>
                    <CustomRefreshControl
                      refreshing={refreshing}
                      scrollY={scrollY}
                    />
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                      tintColor="transparent"
                      colors="transparent"
                      titleColor="transparent"
                      progressViewOffset={30}
                    />
                  </View>
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
                    progressViewOffset={60}
                    colors={
                      theme === 'dark' ? [Colors.BB_violet] : [Colors.BB_bone]
                    }
                    tintColor={
                      theme === 'dark' ? Colors.BB_violet : Colors.BB_bone
                    }
                    progressBackgroundColor={
                      theme === 'dark' ? '#3e3e42' : Colors.BB_darkRedPurple
                    }
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
        currencyData={currencyData}
        setTagsData={setTagsData}
        setConditionsData={setConditionsData}
        setTransactionsData={setTransactionsData}
        setCurrencyData={setCurrencyData}
        selectedTags={selectedTags}
        selectedConditions={selectedConditions}
        selectedTransactions={selectedTransactions}
        selectedCurrency={selectedCurrency}
        setSelectedTags={setSelectedTags}
        setSelectedConditions={setSelectedConditions}
        setSelectedTransactions={setSelectedTransactions}
        setSelectedCurrency={setSelectedCurrency}
        fetchListings={fetchListingsAsync}
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
    </SafeAreaView>
  );
};

export default HomeScreen;
