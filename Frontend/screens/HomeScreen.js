import { serverIp } from "../config.js";
import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, RefreshControl} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import Swiper from "react-native-swiper";
import BottomBar from "../components/BottomBar";
import TopBar from "../components/TopBar";
import Colors from "../constants/Colors";
import { Image } from "expo-image";
import { MaterialCommunityIcons } from "@expo/vector-icons";


const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const HomeScreen = ({ route }) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [listings, setListings] = useState([]);
  const [images, setImages] = useState([]);
  const [swipeIndex, setSwipeIndex] = useState(0);
  const didMount = useRef(false);
  const isFocused = useIsFocused();
  const swiperRef = useRef(null);
  const [starStates, setStarStates] = useState({});


  const onRefresh = React.useCallback(() => {
    console.log("refreshing...");
    setRefreshing(true);
    fetchListings();
  }, []);

  const fetchListings = async () => {
    console.log("Fetching listings...");
    if (route.params?.refresh) route.params.refresh = false;
    try {
      const listingsResponse = await fetch(`${serverIp}/api/listings`, {
        method: "GET",
      });

      if (listingsResponse.status <= 201) {
        const listingsData = await listingsResponse.json();
        //console.log(listingsData);
        const initialStarStates = listingsData.map(() => false);
        setStarStates(initialStarStates);
        setListings(listingsData);
      } else {
        console.log("Error fetching listings:", listingsResponse.status);
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  // This will run on mount
  useEffect(() => {
    fetchListings();
  }, []);

  // stop refreshing animation once we have new listings
  useEffect(() => {
    setRefreshing(false);
  }, [listings]);

  // This will run with refresh = true
  useEffect(() => {
    if (route.params?.refresh) fetchListings();
  }, [route.params]);

  const handleStarPress = (listingId, imageIndex) => {
    console.log(`Starred image at index ${imageIndex} for listing ID ${listingId}`);
  
    // Create a copy of the current star states object
    const newStarStates = { ...starStates };
  
    // Check if the star state object for the current listing exists
    if (!newStarStates[listingId]) {
      newStarStates[listingId] = [];
    }
  
    // Toggle the star state for the specified image
    newStarStates[listingId][imageIndex] = !newStarStates[listingId][imageIndex];
  
    // Update the state with the new star states object
    setStarStates(newStarStates);
  };

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
            refreshControl={
              <RefreshControl
                progressViewOffset={100}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
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
                          <View style={styles.buttonContainer}>
                          <TouchableOpacity
                            style={styles.starButton}
                            activeOpacity={1} // Disable the opacity change on touch
                            onPress={() => handleStarPress(item.ListingId, index)}
                          >
                            {starStates[item.ListingId] && starStates[item.ListingId][index] ? (
                              <MaterialCommunityIcons name="heart" size={30} color="red" />
                            ) : (
                              <MaterialCommunityIcons name="heart-outline" size={30} color="black" />
                            )}
                          </TouchableOpacity>
                          </View>
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
                            <Text style={styles.title}>{`${index + 1}/${
                              item.images.length
                            }`}</Text>
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

const styles = StyleSheet.create({
  screenfield: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  refresh: {
    top: "40%",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: -1,
    backgroundColor: Colors.BB_pink,
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
    bottom: 10, 
    left: 10, 
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 5,
    borderRadius: 5,
  },
  pageContainer: {
    position: "absolute",
    bottom: 10, 
    left: 380, 
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 5,
    borderRadius: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white", 
  },
  price: {
    fontSize: 14,
    color: "white", 
  },
  description: {
    fontSize: 10,
    color: "white", 
  },
  starContainer: {
    position: "absolute",
    top: 10, 
    right: 10, 
  },
  buttonContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  starButton: {
    // Define the style for your star button here
    position: "absolute",
    top: 10, 
    right: 10, 
    
  },
});