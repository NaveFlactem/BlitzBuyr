import { serverIp } from "../config.js";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated as AnimatedRN,
  TouchableWithoutFeedback,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { BlurView as _BlurView } from "expo-blur";
import { parallaxLayout } from "./parallax";
import { Image } from "expo-image";
import Colors from "../constants/Colors";
import FlipCard from "react-native-flip-card";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { PinchGestureHandler } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

const BlurView = Animated.createAnimatedComponent(_BlurView);

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

interface ListingProps {
  key: string;
  item: {
    images: string[];
    ListingId: string;
    Title: string;
    Price: number;
    Description: string;
    Username: string;
    ratings: {
      averageRating: number;
      ratingCount: number;
    };
  };
  starStates: {
    [listingId: string]: boolean;
  };
  handleStarPress: (listingId: string) => void;
  numItems: number;
}

function Listing(props: ListingProps) {
  const navigation = useNavigation();

  const arrayOfURIs = props.item.images.map((imageURI, index) => {
    const modifiedURI = `${serverIp}/img/${imageURI}`;
    return modifiedURI;
  });

  return (
    <FlipCard
      friction={6}
      perspective={1000}
      flipHorizontal={true}
      flipVertical={false}
      flip={false}
      clickable={true}
    >
      <View style={[styles.frontOfCard, {alignSelf: "center", justifyContent: "center",  top:"0%"}]}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{`$${props.item.Price}`}</Text>
        </View>

        <TouchableOpacity
          style={[styles.likeButton, { top: "76%", right: "10%"}]}
          activeOpacity={1} // Disable the opacity change on touch
          onPress={() => props.handleStarPress(props.item.ListingId)}
        >
          {props.starStates[props.item.ListingId] ? (
            <MaterialCommunityIcons name="heart" size={50} color="red" />
          ) : (
            <MaterialCommunityIcons name="heart" size={50} color="black" />
          )}
        </TouchableOpacity>
        <Carousel
          panGestureHandlerProps={{
            activeOffsetX: [-25, 25],
          }}
          loop={false}
          style={styles.frontOfCard}
          vertical={false}
          width={0.85 * screenWidth}
          height={0.75 * screenHeight}
          data={arrayOfURIs}
          mode="parallax"
          scrollAnimationDuration={400}
          renderItem={({ item, index, animationValue }) => (
            <CustomItem
              source={item}
              index={index}
              animationValue={animationValue}
              numItems={props.numItems}
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

      <View style={styles.backOfCard}>
        <View style={styles.top_rhombus} />
        <View style={styles.mid_rhombus} />
        <View style={styles.bottom_rhombus} />
        <View style={styles.topR_circle} />
        <View style={styles.topL_circle} />
        <View style={styles.bottomR_circle} />
        <View style={styles.bottomL_circle} />
        <Text style={styles.title}>{props.item.Title}</Text>

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
                  username: props.item.Username,
                })
              }
            >
              <Image
                source={{
                  uri: `${serverIp}/api/pfp?username=${props.item.Username}`,
                }}
                style={styles.sellerPic}
              />
            </TouchableWithoutFeedback>
            <Text style={styles.sellerName}> {props.item.Username}</Text>
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
              {props.item.ratings.averageRating
                ? props.item.ratings.averageRating
                : "N/A"}{" "}
              (
              {props.item.ratings.ratingCount
                ? props.item.ratings.ratingCount
                : "0"}
              )
            </Text>
          </View>
        </View>

        <ScrollView
          style={styles.descriptionContainer}
          showsVerticalScrollIndicator={true}
          scrollEnabled={true}
        >
          <Text style={styles.description}>{props.item.Description}</Text>
        </ScrollView>

        <View style={[styles.priceContainer, { bottom: "2%", left: "2%" }]}>
          <Text style={[styles.price]}>{`$${props.item.Price}`}</Text>
        </View>
        <TouchableOpacity
          style={[styles.likeButton, {top: "90%", right: "5%"}]}
          activeOpacity={1} // Disable the opacity change on touch
          onPress={() => props.handleStarPress(props.item.ListingId)}
        >
          {props.starStates[props.item.ListingId] ? (
            <MaterialCommunityIcons name="heart" size={50} color="red" />
          ) : (
            <MaterialCommunityIcons name="heart" size={50} color="black" />
          )}
        </TouchableOpacity>
      </View>
    </FlipCard>
  );
}

//has zoom feature, ontouch funcitonality, blurhash, parallax, tap to turn image, vertical swipe to next listing
interface CustomItemProps {
  source: string;
  index: number;
  animationValue: Animated.SharedValue<number>;
  numItems: number;
}
const CustomItem = ({ source, index, animationValue, numItems }) => {
  const maskStyle = useAnimatedStyle(() => {
    const opacity = interpolate(animationValue.value, [-1, 0, 1], [1, 0, 1]);

    return {
      opacity,
    };
  }, [animationValue]);

  const scale = new AnimatedRN.Value(1);

  const onZoomEvent = AnimatedRN.event(
    [
      {
        nativeEvent: {
          scale: scale,
        },
      },
    ],
    { useNativeDriver: true }
  );

  const onZoomStateChange = (event) => {
    if (event.nativeEvent.oldState === 4) {
      AnimatedRN.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View style={[styles.frontOfCard]}>
      <View style={styles.cardBackground}>
        <View style={styles.top_rhombus} />
        <View style={styles.mid_rhombus} />
        <View style={styles.bottom_rhombus} />
        <View style={styles.topR_circle} />
        <View style={styles.topL_circle} />
        <View style={styles.bottomR_circle} />
        <View style={styles.bottomL_circle} />

        <View>
          <PinchGestureHandler
            onGestureEvent={onZoomEvent}
            onHandlerStateChange={onZoomStateChange}
          >
            <AnimatedRN.View style={[{ transform: [{ scale: scale }] }]}>
              <Image
                source={{ uri: source }}
                style={styles.image}
                placeholder={blurhash}
                contentFit="contain"
                transition={200}
              />
            </AnimatedRN.View>
          </PinchGestureHandler>
        </View>
      </View>
      <View style={styles.blurContainer}>
        <BlurView
          intensity={50}
          pointerEvents="none"
          style={[maskStyle, StyleSheet.absoluteFill]}
        />
      </View>
    </View>
  );
};

export default Listing;

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const PAGE_WIDTH = screenWidth / 2;
//////////////////////////////////////////////////////////////////////////////////////
const styles = StyleSheet.create({
  frontOfCard: {
    bottom: 0.128 * screenHeight,
    alignSelf: "center",
    width: screenWidth,
    height: screenHeight,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  cardBackground: {
    position: "absolute",
    top: 0.18 * screenHeight,
    width: 0.9 * screenWidth,
    height: 0.8 * screenHeight,
    backgroundColor: Colors.BB_darkRedPurple,
    borderRadius: 20,
    borderWidth: 10,
    borderColor: "rgba(0, 0, 0, 0.2)",
  },
  top_rhombus: {
    alignSelf: "center",
    position: "absolute",
    top: 0.06 * screenHeight,
    width: "70%",
    aspectRatio: 1,
    backgroundColor: Colors.BB_darkPink,
    opacity: 0.2,
    transform: [{ rotate: "45deg" }],
  },
  mid_rhombus: {
    alignSelf: "center",
    position: "absolute",
    top: 0.26 * screenHeight,
    width: "70%",
    aspectRatio: 1,
    backgroundColor: Colors.BB_darkPink,
    opacity: 0.1,
    transform: [{ rotate: "45deg" }],
  },
  bottom_rhombus: {
    alignSelf: "center",
    position: "absolute",
    top: 0.44 * screenHeight,
    width: "70%",
    aspectRatio: 1,
    backgroundColor: Colors.BB_darkPink,
    opacity: 0.2,
    transform: [{ rotate: "45deg" }],
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
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { height: 4, width: 0 },
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
    shadowColor: "black",
    shadowOpacity: 0.5, 
    shadowRadius: 10,
    shadowOffset: { height: 4, width: 0 },
  },
  bottomR_circle: {
    width: 0.1 * screenWidth,
    height: 0.1 * screenWidth,
    borderRadius: 25,
    backgroundColor: Colors.BB_darkPink,
    opacity: 0.2,
    position: "absolute",
    bottom: 0.03 * screenHeight,
    right: 0.06 * screenWidth,
    shadowColor: "black",
    shadowOpacity: 0.5, 
    shadowRadius: 10,
    shadowOffset: { height: 4, width: 0 },
  },
  bottomL_circle: {
    width: 0.1 * screenWidth,
    height: 0.1 * screenWidth,
    borderRadius: 25,
    backgroundColor: Colors.BB_darkPink,
    opacity: 0.2,
    position: "absolute",
    bottom: 0.03 * screenHeight,
    left: 0.06 * screenWidth,
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { height: 4, width: 0 },
  },
  image: {
    width: 0.85 * screenWidth,
    height: 0.8 * screenHeight,
  },
  blurContainer: {
    position: "absolute",
    top: 0.18 * screenHeight,
    alignSelf: "center",
    width: 0.9 * screenWidth,
    height: 0.8 * screenHeight,
    borderRadius: 20,
  },
  priceContainer: {
    position: "absolute",
    bottom: "18%",
    left: "10%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 5,
    borderRadius: 5,
    zIndex: 10,
  },
  backOfCard: {
    alignSelf: "center",
    alignItems: "center",
    top: 0.05 * screenHeight,
    width: 0.9 * screenWidth,
    height: 0.8 * screenHeight,
    backgroundColor: Colors.BB_darkRedPurple,
    borderRadius: 20,
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { height: 4, width: 0 },
    borderWidth: 10,
    borderColor: "rgba(0, 0, 0, 0.2)",
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
    top: 0.01 * screenHeight,
    fontSize: 25,
    fontWeight: "bold",
    color: "white",
    marginBottom: 0.02 * screenHeight,
  },
  sellerInfoBox: {
    flexDirection: "row",
    top: 0.02 * screenHeight,
    width: 0.8 * screenWidth,
    height: 0.16 * screenHeight,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    marginBottom: 0.1 * screenHeight,
  },
  sellerPic: {
    alignSelf: "center",
    width: "90%",
    height: "70%",
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
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
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
    top: "2%",
    right: "8%",
    zIndex: 50,
  },
});
