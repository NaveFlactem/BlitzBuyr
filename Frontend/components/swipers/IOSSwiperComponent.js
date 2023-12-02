/**
 * @namespace IOSSwiperComponent
 * @memberof Swipers
 * @description - IOS swiper, displays a swiping list,  shows listings that users can swipe through
 *
 */


import React, { memo } from 'react';
import Swiper from 'react-native-swiper';
import Listing from '../Listing';
import BouncePulse from '../visuals/BouncePulse';
import { FlatList } from 'react-native';
/**
 * Represents a component that displays a swiper for iOS.
 * @function IOSSwiperComponentfunc
 * @memberof IOSSwiperComponent
 * @param {object} props - Component props.
 * @param {React.Ref} props.swiperRef - Reference for the swiper component.
 * @param {Array} props.listings - Array of listings to be displayed.
 * @param {React.Component} props.refreshControl - Refresh control component.
 * @param {Function} props.removeListing - Function to remove a listing.
 * @param {object} props.userLocation - User's location information.
 * @param {Function} props.onScroll - Function to handle scroll events.
 * @param {Function} props.handleInnerScrolling - Function to handle inner scrolling.
 * @param {Function} props.handleInnerScrollingEnd - Function to handle inner scroll end.
 * @returns {React.Component} A React component representing the IOSSwiper.
 * @description
 * This component renders a swiper for iOS, displaying a list of listings.
 * It provides functionality for scrolling, refreshing, and handling user interactions.
 */
const IOSSwiperComponent = memo(
  ({
    swiperRef,
    listings,
    refreshControl,
    removeListing,
    userLocation,
    onScroll,
    handleInnerScolling,
    handleInnerScollingEnd,
  }) => {
    const renderItem = ({ item }) => (
      <Listing
        item={item}
        removeListing={removeListing}
        userLocation={userLocation}
        handleInnerScolling={handleInnerScolling}
        handleInnerScollingEnd={handleInnerScollingEnd}
      />
    );
  /**
   * Generates a key for each item in the FlatList.
   * @function KeyExtractorFunction
   * @memberof IOSSwiperComponent
   * @param {object} item - Data for the item.
   * @returns {string} A unique key for the item.
   * @description
   * This function is used by FlatList to generate unique keys for each item based on the ListingId property.
   */

    const keyExtractor = (item) => item.ListingId.toString();

    return (
      <FlatList
        ref={swiperRef}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={2}
        decelerationRate="normal"
        disableIntervalMomentum={true}
        pagingEnabled={true}
        removeClippedSubviews={true}
        data={listings}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        refreshControl={refreshControl}
        onScroll={onScroll}
      />
    );
  },
);

export default IOSSwiperComponent;
