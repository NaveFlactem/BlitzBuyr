/**
 * @namespace Swipers
 * @memberof Components
 */

/**
 * @namespace AndroidSwiperComponent
 * @description - This component is designed to create a swiper/slider functionality for displaying listings in a Android mobile application.
 * @memberof Swipers
 * @memberof Components.Swipers
 * 
 */

import React, { memo } from 'react';
import { FlatList } from 'react-native';
import Listing from '../Listing';

/**
 * @function AndroidSwiperComponent
 * @memberof Swipers.AndroidSwiperComponent
 * @memberof Components.Swipers.AndroidSwiperComponent
 * @description - This function is a memoized function that creates a swiper/slider functionality for displaying listings in a Android mobile application.
 * @param {Object} props - Component props
 * @param {Object} props.swiperRef - Reference to the swiper component
 * @param {Array} props.listings - Array of listings to display
 * @param {Object} props.refreshControl - Refresh control component
 * @param {Function} props.removeListing - Function to remove a listing
 * @param {Object} props.userLocation - User's location
 * @param {Function} props.onScroll - Function to handle scroll event
 * @param {Function} props.handleInnerScolling - Function to handle inner scrolling
 * @param {Function} props.handleInnerScollingEnd - Function to handle inner scrolling end
 * @returns {JSX.Element} - React component
 */
const AndroidSwiperComponent = memo(
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
        swiperRef={swiperRef}
        handleInnerScolling={handleInnerScolling}
        handleInnerScollingEnd={handleInnerScollingEnd}
      />
    );

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
        onScroll={onScroll}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        refreshControl={refreshControl}
      />
    );
  },
);

export default AndroidSwiperComponent;
