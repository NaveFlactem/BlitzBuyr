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
  Animated as AnimatedRN,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FlipCard from 'react-native-flip-card';
import { PinchGestureHandler, ScrollView } from 'react-native-gesture-handler';
import Carousel from 'react-native-reanimated-carousel';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { serverIp } from '../config.js';
import Colors from '../constants/Colors.js';
import { screenHeight, screenWidth } from '../constants/ScreenDimensions.js';
import { handleDeleteListing, handleLike } from '../network/Service.js';
import { getStoredUsername } from '../screens/auth/Authenticate.js';
import { parallaxLayout } from './parallax.ts';
import { useThemeContext } from './visuals/ThemeProvider';
import { getThemedStyles } from '../constants/Styles';

const default_blurhash = 'LEHLk~WB2yk8pyo0adR*.7kCMdnj';

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

const LikeButton = memo(({ isLiked, onLikePress, styles }) => {
  return (
    <React.Fragment>
      <TouchableOpacity onPress={onLikePress} style={styles.likeButton}>
        <MaterialCommunityIcons
          name="heart"
          size={50}
          color={isLiked ? 'red' : 'black'}
        />
      </TouchableOpacity>
    </React.Fragment>
  );
});

const DeleteButton = ({ onDeletePress, styles }) => {
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
    return 14;
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
  } else {
    return 10;
  }
};

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
  },
);

const MemoizedImage = memo(
  ({ source, blurhash, style, contentFit, transition }) => {
    //console.log(`${serverIp}/img/${source.uri}`);
    return (
      <Image
        source={{ uri: source }}
        style={style}
        contentFit={contentFit}
        transition={transition}
        placeholder={blurhash ? blurhash : default_blurhash}
        cachePolicy="memory-disk"
      />
    );
  },
);

const CustomItem = memo(
  ({
    source,
    scale,
    currencySymbol,
    price,
    timeSince,
    isLiked,
    onLikePress,
    onDeletePress,
    deleteVisible,
    styles,
  }) => {
    const onZoomEvent = useCallback(
      AnimatedRN.event([{ nativeEvent: { scale: scale } }], {
        useNativeDriver: true,
      }),
      [],
    );

    const onZoomStateChange = (event) => {
      if (event.nativeEvent.oldState === 4) {
        AnimatedRN.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      }
    };

    /*FRONT CARD*/
    return (
      <CardOverlay
        price={price}
        currencySymbol={currencySymbol}
        timeSince={timeSince}
        cardStyle={styles.cardBackground}
        styles={styles}
      >
        <View>
          <PinchGestureHandler
            onGestureEvent={onZoomEvent}
            onHandlerStateChange={onZoomStateChange}
          >
            <AnimatedRN.View style={[{ transform: [{ scale: scale }] }]}>
              <MemoizedImage
                source={`${serverIp}/img/${source.uri}`}
                blurhash={source.blurhash}
                style={styles.image}
                contentFit="contain"
                transition={0}
              />
            </AnimatedRN.View>
          </PinchGestureHandler>
        </View>
        <LikeButton isLiked={isLiked} onLikePress={onLikePress} styles={styles} />
        {deleteVisible && <DeleteButton onDeletePress={onDeletePress} styles={styles} />}
      </CardOverlay>
    );
  },
);

const Listing = ({ item, origin, removeListing, userLocation, handleInnerScolling, handleInnerScollingEnd }) => {
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
      userLocation.longitude,
    );
  }, [
    item.Latitude,
    item.Longitude,
    userLocation.latitude,
    userLocation.longitude,
  ]);

  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(
    origin == 'profile' && item.Username == getStoredUsername(),
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
                scale={new AnimatedRN.Value(1)}
                price={price}
                currencySymbol={currencySymbol}
                timeSince={timeSince}
                isLiked={isLiked}
                onLikePress={() => handleLikePress()}
                onDeletePress={() => toggleDeleteModal()}
                deleteVisible={deleteVisible}
                origin={origin}
                styles={styles}
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
              },
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
                color="white"
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
                color="gold"
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
              <Text style={{ ...styles.conditionText, top: '30%' }}>
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

          <LikeButton isLiked={isLiked} onLikePress={handleLikePress} styles={styles} />
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

export default memo(Listing);

const PAGE_WIDTH = screenWidth / 2;
