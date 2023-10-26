import { serverIp } from "../config.js";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import Swiper from "react-native-swiper";
import BottomBar from "../components/BottomBar";
import TopBar from "../components/TopBar";
import Colors from "../constants/Colors";
import { Image } from "expo-image";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

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
    backgroundColor: Colors.BB_pink,
    height: "100%",
    width: "100%",
  },
  card: {
    backgroundColor: Colors.BB_darkRedPurple,
    width: "100%",
    height: "81%",
    borderRadius: 0,
    alignItems: "center",
    justifyContent: "center",
    top: "9%",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 0,
  },
  titleContainer: {
    position: "absolute",
    bottom: 10, // Adjust the position as needed
    left: 10, // Adjust the position as needed
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 5,
    borderRadius: 5,
  },
  pageContainer: {
    position: "absolute",
    bottom: 10, // Adjust the position as needed
    left: 380, // Adjust the position as needed
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
  description: {
    fontSize: 10,
    color: "white", // Customize the color
  },
});

const HomeScreen = () => {
  const [listings, setListings] = useState([]);
  const [images, setImages] = useState([]);
  const [swipeIndex, setSwipeIndex] = useState(0);
  const didMount = useRef(false);
  const isFocused = useIsFocused();
  const swiperRef = useRef(null);

  const fetchListings = async () => {
    console.log("Fetching listings...");
    try {
      const listingsResponse = await fetch(`${serverIp}/api/listings`, {
        method: "GET",
      });

      if (listingsResponse.status <= 201) {
        const listingsData = await listingsResponse.json();
        //console.log(listingsData);
        setListings(listingsData);
      } else {
        console.log("Error fetching listings:", listingsResponse.status);
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchListings();
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.screenfield}>
      <TopBar />

      {listings && listings.length > 0 && (
        <View style={styles.container}>
          <Swiper
            ref={swiperRef}
            loop={false}
            horizontal={false}
            showsPagination={false}
            showsButtons={false}
          >
            {listings.map((item, listIndex) => {
              Image.prefetch(item.images);
              return (
                <View key={item.ListingId} style={styles.card}>
                  <Swiper
                    loop={false}
                    horizontal={true}
                    showsButtons={false}
                    showsPagination={false}
                  >
                    {item.images.map((imageURI, index) => {
                      return (
                        <View key={index}>
                          <Image
                            style={styles.image}
                            source={{
                              uri: `${serverIp}/img/${imageURI}`,
                            }}
                            placeholder={blurhash}
                            contentFit="contain"
                            transition={200}
                          />
                          <View style={styles.titleContainer}>
                            <Text style={styles.title}>{item.Title}</Text>
                            <Text style={styles.price}>{`$${item.Price}`}</Text>
                            {item.Description.length > 0 && (
                              <Text style={styles.description}>
                                {item.Description}
                              </Text>
                            )}
                          </View>
                          <View style={styles.pageContainer}>
                            <Text style={styles.title}>{`${index + 1}/${item.images.length}`}</Text>
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
