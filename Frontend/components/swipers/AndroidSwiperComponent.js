
/**
 * @namespace Swipers
 * 
 *
 */



/**
 * @namespace AndroidSwiperComponent
 * @description - This component is designed to create a swiper/slider functionality for displaying listings in a Android mobile application.
 * @memberof Swipers
 * 
 */

import React, { memo } from 'react';
import { FlatList } from 'react-native';
import Listing from '../Listing';

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
