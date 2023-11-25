import React, { memo } from 'react';
import { FlatList } from 'react-native';
import Listing from '../Listing';

const AndroidSwiperComponent = memo(
  ({swiperRef, listings, refreshControl, removeListing, userLocation, onScroll }) => {
    const renderItem = ({ item }) => (
      <Listing
        item={item}
        removeListing={removeListing}
        userLocation={userLocation}
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
