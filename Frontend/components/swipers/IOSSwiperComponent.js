import React, { memo } from 'react';
import Swiper from 'react-native-swiper';
import Listing from '../Listing';
import BouncePulse from '../visuals/BouncePulse';

const IOSSwiperComponent = memo(
  ({ swiperRef, listings, removeListing, userLocation }) => {
    return (
      <Swiper
        ref={swiperRef}
        loop={false}
        horizontal={false}
        showsPagination={false}
        showsButtons={false}
        loadMinimal={true}
        loadMinimalSize={3}
        loadMinimalLoader={<BouncePulse />}
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
