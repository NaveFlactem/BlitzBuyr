/**
 * @namespace Components
 */

/**
 * @namespace Listing
 * @memberof Components
 */

import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Modal,
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { PinchGestureHandler, ScrollView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { serverIp } from '../config.js';
import Colors from '../constants/Colors.js';
import { screenHeight, screenWidth } from '../constants/ScreenDimensions.js';
import { getThemedStyles } from '../constants/Styles';
import { handleDeleteListing, handleLike } from '../network/Service.js';
import { getStoredUsername } from '../screens/auth/Authenticate.js';
import {
  calculateFontSize,
  calculateFontSizeLocation,
  calculateTransactionFontSize,
} from './CalculateFontSize.js';
import FlipCard from './CustomFlipCard.js';
import { parallaxLayout } from './parallax.ts';
import BouncePulse from './visuals/BouncePulse.js';
import { useThemeContext } from './visuals/ThemeProvider';

/**
 * @constant default_blurhash
 * @memberof Components.Listing
 * @description The blurhash to use if the listing does not have a blurhash
 */
const default_blurhash = 'LEHLk~WB2yk8pyo0adR*.7kCMdnj';

/**
 * @param {number} lat1 - Latitude of the first coordinate
 * @param {number} lon1 - Longitude of the first coordinate
 * @param {number} lat2 - Latitude of the second coordinate
 * @param {number} lon2 - Longitude of the second coordinate
 * @function getDistance
 * @description Calculates the distance between two coordinates
 * @returns {number} distance - Distance between the two coordinates in miles
 * @memberof Components.Listing
 */
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

/**
 * @param {boolean} isLiked - Whether the listing is liked by the user
 * @param {function} onLikePress - Function to call when the like button is pressed
 * @param {object} styles - Stylesheet for the component called from the parent component
 * @function LikeButton
 * @description Button to like a listing
 * @returns {object} TouchableOpacity and MaterialCommunityIcon wrapped in React.Fragment
 * @memberof Listing
 */
const LikeButton = memo(({ isLiked, onLikePress, styles }) => {
  const { theme } = useThemeContext();
  return (
    <React.Fragment>
      <TouchableOpacity onPress={onLikePress} style={styles.likeButton}>
        <MaterialCommunityIcons
          name="heart"
          size={50}
          color={
            isLiked
              ? theme === 'dark'
                ? Colors.BB_violet
                : Colors.red
              : Colors.black
          }
        />
      </TouchableOpacity>
    </React.Fragment>
  );
});

/**
 *
 * @param {function} onDeletePress - Function to call when the delete button is pressed
 * @param {object} styles - Stylesheet for the component called from the parent component
 * @function DeleteButton
 * @description Button to delete a listing
 * @returns {object} TouchableOpacity and MaterialCommunityIcon
 * @memberof Listing
 */
const DeleteButton = ({ onDeletePress, styles }) => {
  return (
    <TouchableOpacity style={styles.deleteButton} onPress={onDeletePress}>
      <MaterialCommunityIcons name="trash-can-outline" size={40} color="red" />
    </TouchableOpacity>
  );
};

/**
 * @param {number} timeSince - Time since the listing was posted
 * @param {object} styles - Stylesheet for the component called from the parent component
 * @function TimeBox
 * @description Displays the time since the listing was posted
 * @returns {object} View and Text wrapped in React.Fragment
 * @memberof Listing
 */
const TimeBox = memo(({ timeSince, styles }) => {
  return (
    <React.Fragment>
      <View style={styles.timeSinceContainer}>
        <Text style={styles.timeSinceText}>
          {timeSince < 30
            ? 'Just now'
            : timeSince < 60
            ? `${timeSince} seconds ago`
            : timeSince < 120
            ? `1 minute ago`
            : timeSince < 3600
            ? `${Math.floor(timeSince / 60)} minutes ago`
            : timeSince < 7200
            ? `1 hour ago`
            : timeSince < 86400
            ? `${Math.floor(timeSince / 3600)} hours ago`
            : timeSince < 172800
            ? `1 day ago`
            : `${Math.floor(timeSince / 86400)} days ago`}
        </Text>
      </View>
    </React.Fragment>
  );
});

/**
 * @param {object} children - Children of the listing
 * @param {string} currencySymbol - Currency symbol of the listing
 * @param {number} price - Price of the listing
 * @param {number} timeSince - Time since the listing was posted
 * @param {object} cardStyle - Stylesheet for the card called from the parent component
 * @param {object} styles - Stylesheet for the component called from the parent component
 * @function CardOverlay
 * @description Displays the price, time since, and children (image) of the listing
 * @returns {object} View and Image wrapped in React.Fragment
 * @memberof Listing
 */
const CardOverlay = memo(
  ({ children, currencySymbol, price, timeSince, cardStyle, styles }) => {
    return (
      <View style={styles.card}>
        <View style={cardStyle}>
          <Image
            source={require('../assets/card_background.png')}
            style={styles.backgroundImage}
          />
          <View style={styles.priceContainer}>
            <Text
              style={[
                styles.price,
                { fontSize: calculateFontSize(price) },
                price === 0 && { fontWeight: 'bold' },
              ]}
            >
              {price === 0 ? 'FREE' : `${currencySymbol}${price}`}
            </Text>
          </View>
          {children}
          <TimeBox timeSince={timeSince} styles={styles} />
        </View>
      </View>
    );
  }
);

/**
 * @param {object} source - Source of the image
 * @param {string} blurhash - Blurhash of the image
 * @param {object} style - Stylesheet for the image called from the parent component
 * @param {string} contentFit - How the image should fit in the container
 * @param {number} transition - Transition of the image
 * @function MemoizedImage
 * @description Displays the image of the listing
 * @returns {object} Image
 * @memberof Listing
 */
const MemoizedImage = memo(
  ({ source, blurhash, style, contentFit, transition, theme, loadAnimSize }) => {
    const [isLoading, setIsLoading] = useState(true);

    const PlaceholderOverlay = (
      <View
        style={[
          style,
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
          },
        ]}
      >
        <BouncePulse
          color={theme === 'dark' ? Colors.BB_violet : Colors.BB_darkOrange}
          size={loadAnimSize}
        />
      </View>
    );

    return (
      <View>
        <Image
          source={{ uri: source }}
          style={style}
          contentFit={contentFit}
          transition={transition}
          placeholder={blurhash ? blurhash : default_blurhash}
          cachePolicy="memory-disk"
          onLoad={() => setIsLoading(false)}
        />
        {isLoading && PlaceholderOverlay}
      </View>
    );
  }
);

/**
 * @param {object} source - Source of the image
 * @param {string} currencySymbol - Currency symbol of the listing
 * @param {number} price - Price of the listing
 * @param {number} timeSince - Time since the listing was posted
 * @param {boolean} isLiked - Whether the listing is liked by the user
 * @param {function} onLikePress - Function to call when the like button is pressed
 * @param {function} onDeletePress - Function to call when the delete button is pressed which is only visible if the user is the owner of the listing and the listing is being viewed from the profile screen
 * @param {boolean} deleteVisible - Whether the delete button is visible
 * @param {object} styles - Stylesheet for the component called from the parent component
 * @function CustomItem
 * @description Displays the image of the listing with the ability to zoom in and out and delete the listing if the user is the owner and the listing is being viewed from the profile screen
 * @returns {object} View and Image wrapped in React.Fragment
 * @memberof Listing
 */
const CustomItem = memo(
  ({
    source,
    currencySymbol,
    price,
    timeSince,
    isLiked,
    onLikePress,
    onDeletePress,
    deleteVisible,
    styles,
    theme,
  }) => {
    /**
     * @var {object} focalX
     * @description The x coordinate of the focal point of the pinch gesture
     * @memberof Listing
     */
    const focalX = useSharedValue(0);
    /**
     * @var {object} focalY
     * @description The y coordinate of the focal point of the pinch gesture
     * @default 0
     * @memberof Listing
     */
    const focalY = useSharedValue(0);
    /**
     * @var {object} xCurrent
     * @description The current x coordinate of the image
     * @default 0
     * @memberof Listing
     */
    const xCurrent = useSharedValue(0);
    /**
     * @var {object} yCurrent
     * @description The current y coordinate of the image
     * @default 0
     * @memberof Listing
     */
    const yCurrent = useSharedValue(0);
    /**
     * @var {object} xPrevious
     * @description The previous x coordinate of the image
     * @default 0
     * @memberof Listing
     */
    const xPrevious = useSharedValue(0);
    /**
     * @var {object} yPrevious
     * @description The previous y coordinate of the image
     * @default 0
     * @memberof Listing
     */
    const yPrevious = useSharedValue(0);
    /**
     * @var {object} scaleCurrent
     * @description The current scale of the image
     * @default 1
     * @memberof Listing
     */
    const scaleCurrent = useSharedValue(1);
    /**
     * @var {object} scalePrevious
     * @description The previous scale of the image
     * @default 1
     * @memberof Listing
     */
    const scalePrevious = useSharedValue(1);

    /**
     * @function pinchHandler
     * @description Handles the pinch gesture on the image
     * @returns {void} if the image is at the original size
     * @memberof Listing
     */
    const pinchHandler = useAnimatedGestureHandler({
      /**
       *
       * @param {object} event
       * @description Sets the focal point of the pinch gesture to the center of the image if the pinch gesture is started with two fingers
       * @memberof Listing
       */
      onStart: (event) => {
        if (event.numberOfPointers == 2) {
          focalX.value = event.focalX;
          focalY.value = event.focalY;
        }
      },
      /**
       * @param {object} event
       * @description Sets the current scale of the image to the previous scale of the image if the pinch gesture is ended with two fingers
       * @returns {void} if the image is at the original size
       * @memberof Listing
       */
      onActive: (event) => {
        if (scaleCurrent.value * event.scale < 1) {
          return;
        }

        if (event.numberOfPointers == 2) {
          if (event.oldState === 2) {
            focalX.value = event.focalX;
            focalY.value = event.focalY;
          }
          scaleCurrent.value = event.scale;

          xCurrent.value = (1 - scaleCurrent.value) * (focalX.value - 400 / 2);
          yCurrent.value = (1 - scaleCurrent.value) * (focalY.value - 700 / 2);
        }
      },
      /**
       * @description Resets the image to its original size and position if the pinch gesture is ended with two fingers
       * @memberof Listing
       */
      onEnd: () => {
        scalePrevious.value = withTiming(1); // Reset previous scale to original
        scaleCurrent.value = withTiming(1); // Reset current scale to original

        // Reset previous translations to original
        xPrevious.value = withTiming(0);
        yPrevious.value = withTiming(0);

        // The current translations should also be reset to 0
        xCurrent.value = withTiming(0);
        yCurrent.value = withTiming(0);
      },
    });

    /**
     * @var {object} animatedStyle
     * @description The style of the image
     * @returns {object} transform
     * @memberof Listing
     */
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { translateX: xCurrent.value },
          { translateY: yCurrent.value },
          { scale: scaleCurrent.value },
          { translateX: xPrevious.value },
          { translateY: yPrevious.value },
          { scale: scalePrevious.value },
        ],
      };
    });

    /*FRONT CARD*/
    return (
      <CardOverlay
        price={price}
        currencySymbol={currencySymbol}
        timeSince={timeSince}
        cardStyle={styles.cardBackground}
        styles={styles}
      >
        <PinchGestureHandler onGestureEvent={pinchHandler}>
          <Animated.View style={[styles.image, animatedStyle]}>
            <MemoizedImage
              source={`${serverIp}/img/${source.uri}`}
              blurhash={source.blurhash}
              style={styles.image}
              contentFit="contain"
              transition={0}
              theme={theme}
            />
          </Animated.View>
        </PinchGestureHandler>
        <LikeButton
          isLiked={isLiked}
          onLikePress={onLikePress}
          styles={styles}
        />
        {deleteVisible && (
          <DeleteButton onDeletePress={onDeletePress} styles={styles} />
        )}
      </CardOverlay>
    );
  }
);

/**
 * @param {object} item - Listing object
 * @param {string} origin - Origin of the listing
 * @param {function} removeListing - Function to call when the listing is removed
 * @param {object} userLocation - User's location
 * @param {function} handleInnerScolling - Function to call when the inner scroll view is scrolled
 * @param {function} handleInnerScollingEnd - Function to call when the inner scroll view is scrolled to the end
 * @function Listing
 * @description Displays the listing
 * @returns {object} SafeAreaView and FlipCard wrapped in React.Fragment
 * @memberof Listing
 */
const Listing = ({
  item,
  origin,
  removeListing,
  userLocation,
  handleInnerScolling,
  handleInnerScollingEnd,
}) => {
  const { theme } = useThemeContext();
  const styles = getThemedStyles(useThemeContext().theme).Listing;
  const prevItemRef = useRef();
  useEffect(() => {
    if (prevItemRef.current === item) {
      return;
    }
    prevItemRef.current = item;
  }, [item]);

  const navigation = useNavigation();
  const price = item.Price;
  const currencySymbol = item.CurrencySymbol;
  const [timeSince, setTimeSince] = useState(item.TimeSince);
  useEffect(() => {
    setTimeSince(item.TimeSince);
  }, [item.TimeSince]);
  const [isLiked, setIsLiked] = useState(item.liked); // Initially KNOWN
  const distance = useMemo(() => {
    return getDistance(
      item.Latitude,
      item.Longitude,
      userLocation.latitude,
      userLocation.longitude
    );
  }, [
    item.Latitude,
    item.Longitude,
    userLocation.latitude,
    userLocation.longitude,
  ]);

  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(
    origin == 'profile' && item.Username == getStoredUsername()
  );

  const toggleDeleteModal = useCallback(() => {
    setDeleteModalVisible(!isDeleteModalVisible);
  }, [isDeleteModalVisible]);

  const images = React.useMemo(() => item.images, [item.images]);
  const carouselRef = useRef(null);

  const handleLikePress = useCallback(async () => {
    try {
      await handleLike(item.ListingId, isLiked);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }, [isLiked]);

  return (
    <SafeAreaView>
      <FlipCard
        friction={6}
        perspective={1000}
        flipHorizontal={true}
        flipVertical={false}
        flip={false}
        clickable={true}
        doubleTap={handleLikePress}
      >
        {/*FACE SIDE*/}
        <View style={styles.card}>
          <Carousel
            ref={carouselRef}
            current
            pagingEnabled={true}
            removeClippedSubviews={true}
            initialNumToRender={1}
            maxToRenderPerBatch={1}
            panGestureHandlerProps={{
              activeOffsetX: [-25, 25],
            }}
            loop={false}
            style={styles.card}
            vertical={false}
            width={0.85 * screenWidth}
            height={0.75 * screenHeight}
            data={images}
            windowSize={2}
            mode="parallax"
            scrollAnimationDuration={400}
            renderItem={({ item }) => (
              <CustomItem
                source={item}
                price={price}
                currencySymbol={currencySymbol}
                timeSince={timeSince}
                isLiked={isLiked}
                onLikePress={() => handleLikePress()}
                onDeletePress={() => toggleDeleteModal()}
                deleteVisible={deleteVisible}
                origin={origin}
                styles={styles}
                theme={theme}
              />
            )}
            customAnimation={parallaxLayout(
              {
                size: screenWidth / 2,
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

        {/*BACK SIDE*/}
        <CardOverlay
          price={price}
          currencySymbol={currencySymbol}
          timeSince={timeSince}
          cardStyle={styles.cardBackground2}
          styles={styles}
        >
          <Text style={styles.title}>{item.Title}</Text>
          <View style={styles.sellerInfoBox}>
            <View
              style={[
                {
                  height: '100%',
                  width: '33%',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}
            >
              <Entypo
                name="location-pin"
                size={40}
                color={theme === 'dark' ? Colors.BB_violet : Colors.BB_bone}
                style={styles.locationPin}
              />
              <Text
                style={[
                  styles.city,
                  { fontSize: calculateFontSizeLocation(item.City) },
                ]}
              >
                {item.City}
              </Text>
              <Text style={styles.distance}>
                {distance > 0 ? distance + ' miles' : 'Less than 1 mile'}{' '}
              </Text>
            </View>
            <View
              style={[
                {
                  height: '100%',
                  width: '33%',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}
            >
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Profile', {
                    username: item.Username,
                  })
                }
              >
                <MemoizedImage
                  source={item.ProfilePicture}
                  style={styles.sellerPic}
                  loadAnimSize={5}
                />
              </TouchableOpacity>
              <Text style={styles.sellerName}>{item.Username}</Text>
            </View>
            <View
              style={[
                {
                  height: '100%',
                  width: '33%',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}
            >
              <Entypo
                name="star"
                size={34}
                color={theme === 'dark' ? Colors.BB_violet : 'gold'}
                style={styles.ratingStar}
              />

              <Text style={styles.rating}>
                {item.ratings.averageRating
                  ? item.ratings.averageRating
                  : 'N/A'}{' '}
                ({item.ratings.ratingCount ? item.ratings.ratingCount : '0'})
              </Text>
            </View>
          </View>

          <View style={styles.lowerRow}>
            <View
              style={[
                {
                  height: '100%',
                  width: '33%',
                  alignItems: 'center',
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: 'white',
                  alignSelf: 'center',
                  top: '10%',
                }}
              >
                Condition:
              </Text>
              <Text style={[styles.conditionText]}>{item.Condition}</Text>
            </View>
            <View
              style={[
                {
                  height: '100%',
                  width: '33%',
                  alignItems: 'center',
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: 'bold',
                  color: 'white',
                  alignSelf: 'center',
                  top: '8%',
                }}
              >
                Transaction Preference:
              </Text>
              <Text
                style={{
                  ...styles.conditionText,
                  top: '30%',
                  fontSize: calculateTransactionFontSize(
                    item.TransactionPreference
                  ),
                }}
              >
                {item.TransactionPreference}
              </Text>
            </View>
            <View
              style={[
                {
                  height: '100%',
                  width: '33%',
                  alignItems: 'center',
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: 'white',
                  alignSelf: 'center',
                  top: '8%',
                }}
              >
                Tags:
              </Text>
              <ScrollView
                style={styles.tagColumn}
                onScrollBeginDrag={handleInnerScolling}
                onScrollEndDrag={handleInnerScollingEnd}
              >
                <Pressable>
                  {item.tags &&
                    item.tags.map((tag, index) => (
                      <Text key={index} style={styles.tagText}>
                        {tag}
                      </Text>
                    ))}
                </Pressable>
              </ScrollView>
            </View>
          </View>

          <ScrollView
            style={styles.descriptionContainer}
            showsVerticalScrollIndicator={true}
            scrollEnabled={true}
          >
            <Text style={styles.description}>{item.Description}</Text>
          </ScrollView>

          <LikeButton
            isLiked={isLiked}
            onLikePress={handleLikePress}
            styles={styles}
          />
        </CardOverlay>
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
              onPress={async () => {
                try {
                  await handleDeleteListing(item.ListingId);
                  removeListing(item.ListingId);
                  alert('Listing deleted successfully.');
                } catch (error) {
                  console.error(error);
                  alert(error);
                } finally {
                  toggleDeleteModal(); // Close the modal
                }
              }}
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

export { default_blurhash };
export default memo(Listing);
