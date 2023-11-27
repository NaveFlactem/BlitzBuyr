import React, { memo } from 'react';
import Swiper from 'react-native-swiper';
import Listing from '../Listing';
import BouncePulse from '../visuals/BouncePulse';
import { FlatList } from 'react-native';

const IOSSwiperComponent = memo(
  ({ swiperRef, listings, refreshControl, removeListing, userLocation, onScroll, handleInnerScolling, handleInnerScollingEnd }) => {
    const renderItem = ({ item }) => (
      <Listing
        item={item}
        removeListing={removeListing}
        userLocation={userLocation}
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
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        refreshControl={refreshControl}
        onScroll={onScroll}
      />
    );
  },
);

export default IOSSwiperComponent;
