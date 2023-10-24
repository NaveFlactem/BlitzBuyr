import React, { useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  Text,
  Button,
  TouchableOpacity,
} from "react-native";
import Swiper from "react-native-swiper";
import Icon from "@mui/material/Icon";
import StackNavigator from "../StackNavigator";
import { useNavigation } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  screenfield: {
    height: screenHeight,
    width: screenWidth,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: -1,
    backgroundColor: "#D6447F",
    height: screenHeight,
    width: screenWidth,
  },
  image: {
    height: 0.08 * screenHeight,
    width: 0.08 * screenHeight,
    top: 0.015 * screenHeight,
  },
  topBar: {
    position: "absolute",
    top: 0,
    height: 0.13 * screenHeight,
    width: screenWidth,
    backgroundColor: "#58293F",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 4,
    borderBottomColor: "#F7A859",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    height: 0.1 * screenHeight,
    width: screenWidth,
    backgroundColor: "#58293F",
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 4,
    borderTopColor: "#F7A859",
  },
  card: {
    backgroundColor: "#F7A859",
    width: 0.9 * screenWidth,
    height: 0.7 * screenHeight,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
    top: 0.09 * screenHeight,
  },
  leftTapArea: {
    position: "absolute",
    width: 0.3 * screenWidth,
    height: 0.7 * screenHeight,
    left: 10,
    backgroundColor: "cyan",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  rightTapArea: {
    position: "absolute",
    width: 0.3 * screenWidth,
    height: 0.7 * screenHeight,
    right: 0,
    backgroundColor: "cyan",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  HomeButton: {
    position: "absolute",
    width: 0.3 * screenWidth,
    height: 0.09 * screenHeight,
    backgroundColor: "white",
    borderRadius: 20,
    bottom: 0,
  },
  ListingButton: {
    position: "absolute",
    width: 0.3 * screenWidth,
    height: 0.09 * screenHeight,
    backgroundColor: "white",
    borderRadius: 20,
    right: 0,
  },
  ProfileButton: {
    position: "absolute",
    width: 0.3 * screenWidth,
    height: 0.09 * screenHeight,
    backgroundColor: "white",
    borderRadius: 20,
    left: 0,
  },
});

const HomeScreen = () => {
  const getListing = (listingId) => {
    fetch(`blitzbuyr.lol/api/listing?id=${listingId}`, {
      method: "GET",
    }).then((response) => {
      if (response.status == 200) {
        // this means we got the listings successfully
        return response.json(); // returns the listings
      } else {
        console.log(response.json()[message]);
      }
    });
  };

  const cardDictionary = {
    0: ["red", "crimson", "tomato"],
    1: ["orange", "darkorange", "orangered"],
    2: ["yellow", "gold", "khaki"],
    3: ["green", "limegreen", "forestgreen"],
    4: ["blue", "dodgerblue", "deepskyblue"],
    5: ["purple", "darkorchid", "blueviolet"],
    6: ["pink", "deeppink", "palevioletred"],
    7: ["brown", "saddlebrown", "chocolate"],
  };
  const Listings = Object.entries(cardDictionary);
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.screenfield}>
      <View style={styles.topBar}>
        <Image
          style={styles.image}
          source={require("../assets/icon_transparent.png")}
        />
      </View>

      <View style={styles.container}>
        <Swiper
          showsButtons={false}
          showsPagination={false}
          vertical={true}
          horizontal={false}
        >
          {Listings.map((listing, page) => (
            <View style={styles.card} key={listing}>
              <Swiper
                horizontal={true}
                showsButtons={false}
                showsPagination={false}
                loop={false}
              >
                {Listings[page].map((color, index) => (
                  <View
                    style={{
                      backgroundColor: color,
                      width: 0.9 * screenWidth,
                      height: 0.7 * screenHeight,
                      borderRadius: 20,
                      alignItems: "center",
                      justifyContent: "center",
                      margin: 20,
                      top: 0.09 * screenHeight,
                    }}
                    key={index}
                  >
                    <Text
                      style={{
                        fontSize: 30,
                        fontWeight: "bold",
                        color: "white",
                      }}
                    >
                      {listing[0]}
                    </Text>
                  </View>
                ))}
              </Swiper>
            </View>
          ))}
        </Swiper>
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.HomeButton}
          onPress={() => navigation.navigate("Home")} // Navigate to the 'Home' screen
        />
        <TouchableOpacity
          style={styles.ListingButton}
          onPress={() => navigation.navigate()} // Navigate to the 'Listing' screen
        />
        <TouchableOpacity
          style={styles.ProfileButton}
          onPress={() => navigation.navigate("Profile")} // Navigate to the 'Profile' screen
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
