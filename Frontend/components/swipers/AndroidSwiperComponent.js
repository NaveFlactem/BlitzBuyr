import React, { memo } from 'react';
import { FlatList } from 'react-native';
import Listing from '../Listing';
import BouncePulse from '../visuals/BouncePulse';

const AndroidSwiperComponent = memo(
  ({ swiperRef, listings, refreshControl, removeListing, userLocation }) => {
    const renderItem = ({ item }) => (
      <Listing
        item={item}
        removeListing={removeListing}
        userLocation={userLocation}
      />
    );

    return (
      <FlatList
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={2}
        decelerationRate="normal"
        disableIntervalMomentum={true}
        pagingEnabled={true}
        removeClippedSubviews={true}
        data={listings}
        renderItem={renderItem}
        keyExtractor={(item) => item.ListingId}
        refreshControl={refreshControl}
        //snapToAlignment="start"
        //snapToInterval={Dimensions.get('window').height}
        ListEmptyComponent={<BouncePulse />}
      />
    );
  }
);

export default AndroidSwiperComponent;
