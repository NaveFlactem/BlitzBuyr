import React, { useEffect, useRef, useState } from "react";
import { View, Image, StyleSheet, SafeAreaView, Text } from "react-native";
import Swiper from "react-native-swiper";
import BottomBar from "../components/BottomBar";
import TopBar from "../components/TopBar";
import Colors from "../constants/Colors";

const styles = StyleSheet.create({
  screenfield: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: -1,
    backgroundColor: "#D6447F",
    height: "100%",
    width: "100%",
  },
  card: {
    backgroundColor: Colors.gray,
    width: "90%",
    height: "80%",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    margin: "5%",
    top: "9%",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  titleContainer: {
    position: "absolute",
    bottom: 10, // Adjust the position as needed
    left: 10, // Adjust the position as needed
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 5,
    borderRadius: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white", // Customize the color
  },
  price: {
    fontSize: 14,
    color: "white", // Customize the color
  },
});

const HomeScreen = () => {
  const [listings, setListings] = useState([]);
  const [images, setImages] = useState([]);
  const [swipeIndex, setSwipeIndex] = useState(0);
  const didMount = useRef(false);

  const fetchListings = async () => {
    console.log("Fetching listings...");
    try {
      const listingsResponse = await fetch(
        "http://blitzbuyr.lol/api/listings",
        {
          method: "GET",
        },
      );

      if (listingsResponse.status <= 201) {
        const listingsData = await listingsResponse.json();
        setListings(listingsData.Listings);
        setSwipeIndex(listingsData.Listings[0].ListingId);
      } else {
        console.log("Error fetching listings:", listingsResponse.status);
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const fetchImages = async (index) => {
    if (index == 0) return;
    try {
      //const id = listings[index].ListingId;
      console.log("Fetching images for ListingID " + index);
      const imagesResponse = await fetch(
        `http://blitzbuyr.lol/api/images?listingId=${index}`,
        {
          method: "GET",
        },
      );

      if (imagesResponse.status <= 201) {
        const imagesData = await imagesResponse.json();
        setImages(imagesData.Images);
      } else {
        console.log("Error fetching images:", imagesResponse.status);
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    if (listings.length > 0) {
      fetchImages(swipeIndex);
    }
  }, [swipeIndex, listings]);

  return (
    <SafeAreaView style={styles.screenfield}>
      <TopBar />

      {listings.length > 0 && (
        <View style={styles.container}>
          <Swiper
            loop={false}
            horizontal={false}
            showsPagination={false}
            showsButtons={false}
            onIndexChanged={(index) => setSwipeIndex(listings[index].ListingId)}
          >
            {listings.map((item, listIndex) => {
              return (
                <View key={item.ListingId} style={styles.card}>
                  <Swiper
                    loop={false}
                    horizontal={true}
                    showsPagination={false}
                    showsButtons={false}
                  >
                    {images.map((image, index) => {
                      // console.log(`Listing ID: ${listIndex}, Image: blitzbuyr.lol/${image.ImageURI}`);
                      return (
                        <View key={index}>
                          <Image
                            style={styles.image}
                            source={{
                              uri: `http://blitzbuyr.lol/${image.ImageURI}`,
                            }}
                          />
                          <View style={styles.titleContainer}>
                            <Text style={styles.title}>{item.Title}</Text>
                            <Text style={styles.price}>{`$${item.Price}`}</Text>
                          </View>
                        </View>
                      );
                    })}
                  </Swiper>
                </View>
              );
            })}
          </Swiper>
        </View>
      )}

      <BottomBar />
    </SafeAreaView>
  );
};

export default HomeScreen;
