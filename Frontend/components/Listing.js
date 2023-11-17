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

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

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

const calculateFontSize = (price) => {
  if (price === undefined || price === null) {
    return 16; // Default font size if price is not provided
  }
  
  const numberOfDigits = price.toString().length;

  if (numberOfDigits <= 4) {
    return 20;
  } else if (numberOfDigits <= 6) {
    return 18;
  } else {
    return 16;
  }
};

const CardOverlay1 = memo(({ children, price }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardBackground}>
        <View style={styles.priceContainer}>
          <Text
            style={[styles.price, { fontSize: calculateFontSize(price) }]}
          >{`$${price}`}</Text>
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
            style={[styles.price, { fontSize: calculateFontSize(price) }]}
          >{`$${price}`}</Text>
        </View>
        {children}
      </View>
    </View>
  );
});

const MemoizedImage = memo(
  ({ source, style, contentFit, transition }) => {
    return (
      <Image
        source={{ uri: source }}
        style={style}
        contentFit={contentFit}
        transition={transition}
      />
    );
  }
  );
  
  const CustomItem = memo(
    ({ source, scale, price, isLiked, onLikePress }) => {
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
      </CardOverlay1>
    );
  }
);

const Listing = ({ item }) => {
  const navigation = useNavigation();
  const price = item.Price;
  const [isLiked, setIsLiked] = useState(null); // Initially unknown

  useEffect(() => {
    const checkLikedStatus = async () => {
      const username = await SecureStore.getItemAsync("username");
      if (username) {
        const liked = await checkIfLiked(username, item.ListingId);
        setIsLiked(liked);
      }
    };

    checkLikedStatus();
  }, [item.ListingId]);

  const checkIfLiked = async (username, listingId) => {
    try {
      const response = await fetch(`${serverIp}/api/check-like?username=${encodeURIComponent(username)}&listingId=${listingId}`);
      if (response.ok) {
        const data = await response.json();
        return data.isLiked;
      } else {
        console.error('Failed to fetch like status');
        return false;
      }
    } catch (error) {
      console.error('Error fetching like status:', error);
      return false;
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
        console.error('Failed to update like status');
      }
    } catch (error) {
      console.error('Error updating like status:', error);
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
              <Text style={styles.city}>Toronto</Text>
              <Text style={styles.distance}>2.5 km</Text>
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
    height: 0.8 * screenHeight,
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
});
