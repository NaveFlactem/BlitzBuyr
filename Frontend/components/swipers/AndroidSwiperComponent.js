import React from "react";
import Swiper from "react-native-swiper";
import { memo } from "react";
import { Image } from "expo-image";
import Listing from "../Listing";

const AndroidSwiperComponent = memo(
  ({
    swiperRef,
    listings,
    refreshControl,
    removeListing,
    userLocation,
    onIndexChanged,
  }) => {
    return (
      <Swiper
        ref={swiperRef}
        loop={false}
        horizontal={false}
        showsPagination={false}
        showsButtons={false}
        refreshControl={refreshControl}
        onIndexChanged={onIndexChanged}
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
  },
);

export default AndroidSwiperComponent;
