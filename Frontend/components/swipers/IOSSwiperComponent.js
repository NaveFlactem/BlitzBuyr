import React from 'react';
import Swiper from 'react-native-swiper';
import {memo} from 'react';
import Listing from '../Listing';

const IOSSwiperComponent = memo(
    ({ swiperRef, listings, removeListing, userLocation, onIndexChanged }) => {
      return (
        <Swiper
          ref={swiperRef}
          loop={false}
          horizontal={false}
          showsPagination={false}
          showsButtons={false}
          onIndexChanged={onIndexChanged}
        >
          {listings.map((item) => (
            <Listing
              key={item.ListingId}
              item={item}
              removeListing={removeListing}
              userLocation={userLocation}
            />
          ))}
        </Swiper>
      );
    }
  );

  export default IOSSwiperComponent;