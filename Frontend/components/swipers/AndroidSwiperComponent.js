import { Image } from 'expo-image';
import React, { memo } from 'react';
import Swiper from 'react-native-swiper';
import Listing from '../Listing';

const AndroidSwiperComponent = memo(
  ({ swiperRef, listings, refreshControl, removeListing, userLocation }) => {
    return (
      <Swiper
        ref={swiperRef}
        loop={false}
        horizontal={false}
        showsPagination={false}
        showsButtons={false}
        refreshControl={refreshControl}
      >
        {listings.map((item, listIndex) => {
          Image.prefetch(item.images);
          return (
            <Listing
              key={item.ListingId}
              item={item}
              removeListing={removeListing}
              userLocation={userLocation}
            />
          );
        })}
      </Swiper>
    );
  }
);

export default AndroidSwiperComponent;
