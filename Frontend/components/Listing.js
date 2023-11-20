import { serverIp } from "../config.js";
import React, { useState, memo, useCallback, useEffect } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated as AnimatedRN,
  TouchableWithoutFeedback,
  Platform,
  SafeAreaView,
  Modal,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { parallaxLayout } from "./parallax.ts";
import { Image } from "expo-image";
import Colors from "../constants/Colors.js";
import FlipCard from "react-native-flip-card";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { PinchGestureHandler } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import {
  getStoredPassword,
  getStoredUsername,
} from "../screens/auth/Authenticate.js";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

function getDistance(lat1, lon1, lat2, lon2) {
  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in kilometers
  const distanceMiles = distance * 0.621371; // Convert distance to miles

  return Math.floor(distanceMiles);
}

const LikeButton = ({ isLiked, onLikePress }) => {
  return (
    <TouchableOpacity onPress={onLikePress} style={styles.likeButton}>
      <MaterialCommunityIcons
        name="heart"
        size={50}
        color={isLiked ? "red" : "black"}
      />
    </TouchableOpacity>
  );
};

const DeleteButton = ({ onDeletePress }) => {
  return (
    <TouchableOpacity style={styles.deleteButton} onPress={onDeletePress}>
      <MaterialCommunityIcons name="trash-can-outline" size={30} color="red" />
    </TouchableOpacity>
  );
};

const calculateFontSize = (price) => {
  if (price === undefined || price === null) {
    return 16; // Default font size if price is not provided
  }

  const numberOfDigits = price.toString().length;
  if (price == 0) {
    return 24;
  }


  if (numberOfDigits <= 4) {
    return 20;
  } else if (numberOfDigits <= 6) {
    return 18;
  } else if (numberOfDigits <= 8) {
    return 16;
  } else if (numberOfDigits <= 10) {
    return 14
  } else {
    return 12;
  }
};

const calculateFontSizeLocation = (city) => {
    if (city === undefined || city === null) {
      return 16; // Default font size if price is not provided
    }
  
    if (city.length <= 10) {
      return 14;
    } else if (city.length <= 15) {
      return 12;
    }
    else {
      return 10;
    }
    
};

const CardOverlay1 = memo(({ children, price }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardBackground}>
        <View style={styles.priceContainer}>
        <Text
            style={[styles.price, { fontSize: calculateFontSize(price) }, price === 0 && {fontWeight: "bold"}]}
          >
            {price === 0 ? "FREE" : `$${price}`}
            </Text>
        </View>
        {children}
      </View>
    </View>
  );
});

const CardOverlay2 = memo(({ children, price }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardBackground2}>
        <View style={styles.top_rhombus} />
        <View style={styles.mid_rhombus} />
        <View style={styles.bottom_rhombus} />
        <View style={styles.topR_circle} />
        <View style={styles.topL_circle} />
        <View style={styles.priceContainer}>
          <Text
            style={[styles.price, { fontSize: calculateFontSize(price) }, price === 0 && {fontWeight: "bold"}]}
          >
            {price === 0 ? "FREE" : `$${price}`}
            </Text>
        </View>
        {children}
      </View>
    </View>
  );
});

const MemoizedImage = memo(({ source, style, contentFit, transition }) => {
  return (
    <Image
      source={{ uri: source }}
      style={style}
      contentFit={contentFit}
      transition={transition}
    />
  );
});

const CustomItem = memo(
  ({
    source,
    scale,
    price,
    isLiked,
    onLikePress,
    onDeletePress,
    deleteVisible,
    origin,
  }) => {
    const onZoomEvent = AnimatedRN.event([{ nativeEvent: { scale: scale } }], {
      useNativeDriver: true,
    });

    const onZoomStateChange = (event) => {
      if (event.nativeEvent.oldState === 4) {
        AnimatedRN.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      }
    };

    return (
      <CardOverlay1 price={price}>
        <View>
          <PinchGestureHandler
            onGestureEvent={onZoomEvent}
            onHandlerStateChange={onZoomStateChange}
          >
            <AnimatedRN.View style={[{ transform: [{ scale: scale }] }]}>
              <MemoizedImage
                source={source}
                style={styles.image}
                contentFit="contain"
                transition={0}
              />
            </AnimatedRN.View>
          </PinchGestureHandler>
        </View>
        <LikeButton isLiked={isLiked} onLikePress={onLikePress} />
        {deleteVisible && <DeleteButton onDeletePress={onDeletePress} />}
      </CardOverlay1>
    );
  }
);

const Listing = ({ item, origin, removeListing, userLocation }) => {
  const navigation = useNavigation();
  const price = item.Price;
  const [isLiked, setIsLiked] = useState(item.liked); // Initially KNOWN
  const [distance, setDistance] = useState(
    item.Latitude
      ? getDistance(
          item.Latitude,
          item.Longitude,
          userLocation.latitude,
          userLocation.longitude
        )
      : "Unknown"
  );
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(
    origin == "profile" && item.Username == getStoredUsername()
  );

  const toggleDeleteModal = () => {
    setDeleteModalVisible(!isDeleteModalVisible);
  };

  const handleDeleteListing = async () => {
    try {
      const username = getStoredUsername();
      const password = getStoredPassword();
      const response = await fetch(`${serverIp}/api/deletelisting`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, listingId: item.ListingId }),
      });

      const responseData = await response.json();

      if (response.ok) {
        removeListing(item.ListingId);
        alert("Listing deleted successfully.");
      } else {
        alert(`Error deleting listing: ${responseData.error}`);
      }
    } catch (error) {
      console.error("Error deleting listing:", error);
      alert(`Error deleting listing: ${error}`);
    } finally {
      toggleDeleteModal(); // Close the modal
    }
  };

  const handleLikePress = async () => {
    const username = await SecureStore.getItemAsync("username");
    const method = isLiked ? "DELETE" : "POST";
    try {
      const response = await fetch(`${serverIp}/api/like`, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, listingId: item.ListingId }),
      });

      if (response.ok) {
        setIsLiked(!isLiked);
      } else {
        console.error("Failed to update like status");
      }
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  const arrayOfURIs = item.images.map((imageURI, index) => {
    const modifiedURI = `${serverIp}/img/${imageURI}`;
    return modifiedURI;
  });

  return (
    <SafeAreaView>
      <FlipCard
        friction={6}
        perspective={1000}
        flipHorizontal={true}
        flipVertical={false}
        flip={false}
        clickable={true}
      >
        <View style={styles.card}>
          <Carousel
            panGestureHandlerProps={{
              activeOffsetX: [-25, 25],
            }}
            loop={false}
            style={styles.card}
            vertical={false}
            width={0.85 * screenWidth}
            height={0.75 * screenHeight}
            data={arrayOfURIs}
            mode="parallax"
            scrollAnimationDuration={400}
            renderItem={({ item, index, animationValue }) => (
              <CustomItem
                source={item}
                scale={new AnimatedRN.Value(1)}
                price={price}
                isLiked={isLiked}
                onLikePress={() => handleLikePress()}
                onDeletePress={() => toggleDeleteModal()}
                deleteVisible={deleteVisible}
                origin={origin}
              />
            )}
            customAnimation={parallaxLayout(
              {
                size: PAGE_WIDTH,
                vertical: false,
              },
              {
                parallaxScrollingScale: 1,
                parallaxAdjacentItemScale: 0.5,
                parallaxScrollingOffset: 10,
              }
            )}
          />
        </View>

        <CardOverlay2 price={item.Price}>
          <Text style={styles.title}>{item.Title}</Text>
          <View style={styles.sellerInfoBox}>
            <View
              style={[
                {
                  height: "100%",
                  width: "33%",
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
            >
              <Entypo
                name="location-pin"
                size={40}
                color="white"
                style={styles.locationPin}
              />
              <Text style={[styles.city, {fontSize: calculateFontSizeLocation(item.City)}]}>{item.City}</Text>
              <Text style={styles.distance}>{distance > 0 ? distance + "miles": "Less than 1 mile"} </Text>
            </View>
            <View
              style={[
                {
                  height: "100%",
                  width: "33%",
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
            >
              <TouchableWithoutFeedback
                onPress={() =>
                  navigation.navigate("Profile", {
                    username: item.Username,
                  })
                }
              >
                <Image
                  source={{
                    uri: `${serverIp}/api/pfp?username=${item.Username}`,
                  }}
                  style={styles.sellerPic}
                />
              </TouchableWithoutFeedback>
              <Text style={styles.sellerName}> {item.Username}</Text>
            </View>
            <View
              style={[
                {
                  height: "100%",
                  width: "33%",
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
            >
              <Entypo
                name="star"
                size={34}
                color="gold"
                style={styles.ratingStar}
              />

              <Text style={styles.rating}>
                {item.ratings.averageRating
                  ? item.ratings.averageRating
                  : "N/A"}{" "}
                ({item.ratings.ratingCount ? item.ratings.ratingCount : "0"})
              </Text>
            </View>
          </View>

          <ScrollView
            style={styles.descriptionContainer}
            showsVerticalScrollIndicator={true}
            scrollEnabled={true}
          >
            <Text style={styles.description}>{item.Description}</Text>
          </ScrollView>

          <LikeButton isLiked={isLiked} onLikePress={handleLikePress} />
        </CardOverlay2>
      </FlipCard>

      {/* Delete Confirmation Modal */}
      <Modal
        transparent={true}
        visible={isDeleteModalVisible}
        animationType="slide"
        onRequestClose={() => toggleDeleteModal()}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>
            Are you sure you want to delete this listing?
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => handleDeleteListing()}
            >
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => toggleDeleteModal()}
            >
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Listing;

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const PAGE_WIDTH = screenWidth / 2;
//////////////////////////////////////////////////////////////////////////////////////
const styles = StyleSheet.create({
  card: {
    height: screenHeight,
    width: screenWidth,
    alignItems: "center",
  },
  cardBackground: {
    position: "absolute",
    width: 0.9 * screenWidth,
    height: 0.79 * screenHeight,
    backgroundColor: Colors.BB_darkRedPurple,
    borderRadius: 20,
    borderWidth: 0.01 * screenHeight,
    justifyContent: "center",
    overflow: "hidden",
    borderColor: Colors.BB_darkerRedPurple,
    bottom: Platform.OS == "ios" ? "28%" : "23%",
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOpacity: 0.5,
        shadowRadius: 10,
        shadowOffset: { height: 4, width: 0 },
      },
      android: {
        elevation: 10,
      },
    }),
  },
  cardBackground2: {
    position: "absolute",
    width: 0.9 * screenWidth,
    height: 0.8 * screenHeight,
    backgroundColor: Colors.BB_darkRedPurple,
    borderRadius: 20,
    borderWidth: 0.01 * screenHeight,
    justifyContent: "center",
    overflow: "hidden",
    borderColor: Colors.BB_darkerRedPurple,
    bottom: Platform.OS == "ios" ? "15.5%" : "10%",
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOpacity: 0.5,
        shadowRadius: 10,
        shadowOffset: { height: 4, width: 0 },
      },
      android: {
        elevation: 10,
      },
    }),
  },
  top_rhombus: {
    alignSelf: "center",
    position: "absolute",
    width: "100%",
    aspectRatio: 1,
    backgroundColor: Colors.BB_darkPink,
    opacity: 0.2,
    transform: [{ rotate: "45deg" }],
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOpacity: 0.5,
        shadowRadius: 10,
        shadowOffset: { height: 4, width: 0 },
      },
      android: {
        elevation: 10,
      },
    }),
  },
  mid_rhombus: {
    alignSelf: "center",
    position: "absolute",
    width: "70%",
    aspectRatio: 1,
    backgroundColor: Colors.BB_darkPink,
    opacity: 0.1,
    transform: [{ rotate: "45deg" }],
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOpacity: 0.5,
        shadowRadius: 10,
        shadowOffset: { height: 4, width: 0 },
      },
      android: {
        elevation: 10,
      },
    }),
  },
  bottom_rhombus: {
    alignSelf: "center",
    position: "absolute",
    width: "35%",
    aspectRatio: 1,
    backgroundColor: Colors.BB_darkPink,
    opacity: 0.2,
    transform: [{ rotate: "45deg" }],
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOpacity: 0.5,
        shadowRadius: 10,
        shadowOffset: { height: 4, width: 0 },
      },
      android: {
        elevation: 10,
      },
    }),
  },
  topR_circle: {
    width: 0.1 * screenWidth,
    height: 0.1 * screenWidth,
    borderRadius: 25,
    backgroundColor: Colors.BB_darkPink,
    opacity: 0.2,
    position: "absolute",
    top: 0.03 * screenHeight,
    right: 0.06 * screenWidth,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOpacity: 0.5,
        shadowRadius: 10,
        shadowOffset: { height: 4, width: 0 },
      },
      android: {
        elevation: 10,
      },
    }),
  },
  topL_circle: {
    width: 0.1 * screenWidth,
    height: 0.1 * screenWidth,
    borderRadius: 25,
    backgroundColor: Colors.BB_darkPink,
    opacity: 0.2,
    position: "absolute",
    top: 0.03 * screenHeight,
    left: 0.06 * screenWidth,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOpacity: 0.5,
        shadowRadius: 10,
        shadowOffset: { height: 4, width: 0 },
      },
      android: {
        elevation: 10,
      },
    }),
  },
  priceContainer: {
    position: "absolute",
    zIndex: 5,
    width: "60%",
    height: 0,
    bottom: 0,
    left: -70,
    borderBottomWidth: 50,
    borderBottomColor: Colors.BB_darkerRedPurple,
    borderLeftWidth: 50,
    borderLeftColor: "transparent",
    borderRightWidth: 50,
    borderRightColor: "transparent",
    borderStyle: "solid",
    alignSelf: "center",
  },
  image: {
    height: "100%",
    width: "100%",
  },
  title: {
    alignSelf: "center",
    position: "absolute",
    top: "0%",
    fontSize: 25,
    fontWeight: "bold",
    color: "white",
    marginBottom: 0.02 * screenHeight,
  },
  sellerInfoBox: {
    position: "absolute",
    alignSelf: "center",
    flexDirection: "row",
    top: "7%",
    width: "90%",
    height: "20%",
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    marginBottom: 0.1 * screenHeight,
  },
  sellerPic: {
    alignSelf: "center",
    width: "90%",
    height: "70%",
    aspectRatio: 1,
    borderRadius: 20,
    marginBottom: "2%",
  },
  sellerName: {
    alignSelf: "center",
    alignContent: "center",
    textAlign: "center",
    marginTop: "4%",
    width: "300%",
    fontSize: 10,
    fontWeight: "bold",
    color: "white",
  },
  locationPin: {
    position: "absolute",
    alignSelf: "center",
    width: "40%",
    height: "60%",
    borderRadius: 20,
  },
  city: {
    alignSelf: "center",
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
    position: "absolute",
    top: "50%",
  },
  distance: {
    alignSelf: "center",
    fontSize: 12,
    color: "white",
    position: "absolute",
    top: "62%",
  },
  ratingStar: {
    alignSelf: "center",
    position: "absolute",
    width: "30%",
    height: "60%",
    borderRadius: 20,
  },
  rating: {
    alignSelf: "center",
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
    position: "absolute",
    top: "50%",
  },
  price: {
    fontSize: (0.9 * screenWidth) / 3 / 5,
    position: "absolute",
    color: "white",
    fontWeight: "bold",
    zIndex: 10,
    left: "20%",
    top: 0.01 * screenHeight,
  },
  descriptionContainer: {
    position: "absolute",
    alignSelf: "center",
    height: "50%",
    width: "90%",
    bottom: "15%",
    backgroundColor: "rgba(10, 10, 10, 0.9)",
    padding: 5,
    borderRadius: 5,
  },
  description: {
    fontSize: 16,
    color: "white",
  },
  likeButton: {
    position: "absolute",
    height: "10%",
    width: "15%",
    bottom: "0%",
    right: "5%",
    zIndex: 50,
  },
  deleteButton: {
    position: "absolute",
    height: "95%",
    width: "10%",
    bottom: "0%",
    right: "5%",
    zIndex: 49,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 2,
    alignSelf: "center",
    marginTop: "80%",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
});
