import {
  AntDesign,
  Entypo,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { Image } from 'expo-image';
import * as SecureStore from 'expo-secure-store';
import React, { memo, useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  SafeAreaView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { TabBar, TabView } from 'react-native-tab-view';
import Listing, { default_blurhash } from '../components/Listing.js';
import BouncePulse from '../components/visuals/BouncePulse.js';
import { useThemeContext } from '../components/visuals/ThemeProvider.js';
import { serverIp } from '../config.js';
import Colors from '../constants/Colors';
import { screenHeight, screenWidth } from '../constants/ScreenDimensions.js';
import { getThemedStyles } from '../constants/Styles.js';
import {
  calculateTimeSince,
  getLocationWithRetry,
} from '../constants/Utilities';
import useBackButtonHandler from '../hooks/DisableBackButton.js';
import { saveContactInfo } from '../network/Service';
import {
  clearStoredCredentials,
  getStoredPassword,
  getStoredUsername,
} from './auth/Authenticate.js';

/**
 * @namespace ProfileScreen
 * @memberof Screens
 *
 *
 */

/**
 * @function ListingsRoute
 * @memberof Screens.ProfileScreen
 * @param {Function} onPressListing - Function to call when a listing is pressed
 * @param {Array} data - Array of listings to display
 * @param {String} text - Text to display if there are no listings
 * @param {Object} styles - Styles object
 * @description A component that displays listings in a grid
 * @returns {JSX.Element}
 */
const ListingsRoute = ({ onPressListing, data, text, styles }) => (
  <View style={{ flex: 1 }}>
    {data.length > 0 ? (
      <FlatList
        data={data}
        numColumns={3}
        renderItem={({ item }) => (
          <View
            style={{
              flex: 1,
              aspectRatio: 1,
              margin: 3,
            }}
          >
            {data.length > 0 && (
              <TouchableOpacity onPress={() => onPressListing(item)}>
                <Image
                  source={{
                    uri: `${serverIp}/img/${item.images[0].uri}`, // load the listing's first image
                  }}
                  placeholder={
                    item.images[0].blurhash
                      ? item.images[0].blurhash
                      : default_blurhash
                  }
                  style={{ width: '100%', height: '100%', borderRadius: 12 }}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    ) : (
      <Text style={styles.noListingsText}>No {text} listings found.</Text>
    )}
  </View>
);

/**
 * @function handleContactClick
 * @memberof Screens.ProfileScreen
 * @async
 * @param {String} key - The key representing the type of contact information to update.
 * @param {String} data - The new value to be set for the specified contact information.
 * @returns {void}
 */
const handleContactClick = async (key, data) => {
  switch (key) {
    case 'email':
      console.log('email');
      try {
        await Linking.openURL(
          `mailto:${data}?subject=${encodeURIComponent(
            'BlitzBuyr'
          )}&body=${encodeURIComponent('')}`
        );
      } catch (error) {
        console.error('Error opening email:', error);
      }
      break;
    case 'phone':
      try {
        // Assuming `data` is your phone number
        const phoneNumber = data;
        Alert.alert(
          'Choose an action',
          'Would you like to call or text this number?',
          [
            {
              text: 'Call',
              onPress: () => Linking.openURL(`tel:${phoneNumber}`),
            },
            {
              text: 'Text',
              onPress: () => Linking.openURL(`sms:${phoneNumber}`),
            },
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
            },
          ],
          { cancelable: true }
        );
      } catch (error) {
        console.error('Error opening phoneNumber:', error);
      }
      break;
    case 'linkedIn':
      try {
        await Linking.openURL(`http://${key}.com/in/${data}`);
      } catch (error) {
        console.error(`Error opening ${key}:`, error);
      }
      break;
    default:
      try {
        await Linking.openURL(`http://${key}.com/${data}`);
      } catch (error) {
        console.error(`Error opening ${key}:`, error);
      }
      break;
  }
};

/**
 * @function ContactInfoRoute
 * @memberof Screens.ProfileScreen
 * @param {Boolean} selfProfile - Whether or not the profile being viewed is the user's own profile
 * @param {Object} contactInfo - Object containing the contact information to be displayed
 * @param {Function} setContactInfo - Function to set the contact information
 * @returns {JSX.Element}
 */
const ContactInfoRoute = ({ selfProfile, contactInfo, setContactInfo }) => {
  const theme = useThemeContext().theme;
  const styles = getThemedStyles(theme).ProfileScreen;
  let displayValues = Object.values(contactInfo).some(
    (value) => value.data?.length > 0
  );

  if (!selfProfile && Object.values(contactInfo).every((value) => value.hidden))
    displayValues = false;

  // hide settings
  /**
   * @function updateHidden
   * @memberof Screens.ProfileScreen
   * @async
   * @param {String} key - The key representing the type of contact information to update.
   * @returns {void}
   */
  const updateHidden = useCallback(
    async (key) => {
      const newContactInfo = {
        ...contactInfo,
        [key]: {
          ...contactInfo[key],
          hidden: !contactInfo[key].hidden,
        },
      };
      setContactInfo(newContactInfo);
      saveContactInfo(newContactInfo);

      console.log(
        `${newContactInfo[key].hidden ? 'Hidden' : 'Unhidden'} ${key}`
      );
    },
    [contactInfo]
  );

  /**
   * @function formatPhoneNumber
   * @memberof Screens.ProfileScreen
   * @param {String} phoneNumberString - The phone number to format
   * @returns {String} The formatted phone number
   * @description Formats a phone number to be displayed in the format (xxx)-xxx-xxxx
   */
  const formatPhoneNumber = (phoneNumberString) => {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ')-' + match[2] + '-' + match[3];
    }
    return null;
  };

  return (
    <View style={styles.contactInfoContainer}>
      <ScrollView>
        <View>
          {displayValues ? (
            Object.entries(contactInfo).map(([key, value]) => {
              if (value.data?.length > 0) {
                const displayData =
                  key === 'phone' ? formatPhoneNumber(value.data) : value.data;
                return (
                  (selfProfile || (!selfProfile && !value.hidden)) && (
                    <View key={key}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}
                      >
                        {/* Icon + Handle */}
                        <TouchableOpacity
                          onPress={() => handleContactClick(key, displayData)}
                          style={styles.socialIcons}
                        >
                          <AntDesign
                            name={value.icon}
                            size={24}
                            color={theme === 'light' ? 'black' : Colors.BB_bone}
                            style={{
                              opacity: value.hidden ? 0.25 : 1.0,
                            }}
                          />
                          <Text
                            style={[
                              styles.socialText,
                              theme === 'light'
                                ? { color: 'black' }
                                : { color: Colors.BB_bone },
                              { opacity: value.hidden ? 0.25 : 1.0 },
                            ]}
                          >
                            {displayData}
                          </Text>
                        </TouchableOpacity>
                        {/* Visibility */}
                        {selfProfile && (
                          <TouchableOpacity
                            onPress={() => updateHidden(key)}
                            style={[
                              styles.socialIcons,
                              { opacity: value.hidden ? 0.25 : 1.0 },
                            ]}
                          >
                            <MaterialIcons
                              name="visibility"
                              size={24}
                              color={
                                theme === 'light'
                                  ? Colors.BB_darkRedPurple
                                  : Colors.BB_violet
                              }
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  )
                );
              }
            })
          ) : (
            <Text style={styles.noListingsText}>
              No Contact Information Available.
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

/**
 * @function ProfileScreen
 * @memberof Screens.ProfileScreen
 * @param {Object} navigation - Stack navigation object
 * @param {Object} route - React route object
 * @description A component that displays a user's profile
 * @returns {JSX.Element}
 */
function ProfileScreen({ navigation, route }) {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [profileInfo, setProfileInfo] = useState(null);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState('');
  const [selfProfile, setSelfProfile] = useState(null); // this needs to be a global state or something, after auth so we don't keep doing this everywhere.
  const [routes, setRoutes] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [LikeStates, setLikeStates] = useState({});
  const theme = useThemeContext().theme;
  const styles = getThemedStyles(theme).ProfileScreen;

  // Use states for contact info
  const [contactInfo, setContactInfo] = useState({
    phone: { data: '2132149702', hidden: false, icon: 'phone' },
    email: { data: 'Email', hidden: false, icon: 'mail' },
    linkedIn: { data: 'LinkedIn', hidden: false, icon: 'linkedin-square' },
    instagram: { data: 'Instagram', hidden: false, icon: 'instagram' },
    facebook: { data: 'Facebook', hidden: false, icon: 'facebook-square' },
    twitter: { data: 'Twitter', hidden: false, icon: 'twitter' },
  });

  // Disable back button
  const onBackPress = () => {
    return true;
  };
  useBackButtonHandler(onBackPress);

  // Handle listing press
  const onPressListing = (listingDetails) => {
    setSelectedListing(listingDetails);
  };

  useEffect(() => {
    /**
     * @function fetchUsername
     * @memberof Screens.ProfileScreen
     * @async
     * @description Fetches the username of the profile to be displayed.
     * @returns {void}
     */
    const fetchUsername = async () => {
      const username = getStoredUsername();
      if (route.params?.username) {
        console.log(
          `Setting username to passed username ${route.params.username}`
        );
        // we navigated with a username passed as param (i.e. clicking someone's profile)
        setProfileName(route.params.username);
        setSelfProfile(false);
      } else {
        console.log(`Setting username to cached logged in user`);
        setProfileName(username);
        setSelfProfile(true);
      }
      getProfileInfo(route.params?.username ? route.params.username : username);
    };

    const getUserLocation = async () => {
      console.log("Getting user's location...");

      try {
        const location = await getLocationWithRetry();
        const { latitude, longitude } = location.coords;
        setUserLocation({ latitude, longitude });
      } catch (error) {
        console.error('Error getting location:', error);
        // FIXME: Handle the error appropriately
      }
    };

    setLoading(true);
    if (isFocused) {
      fetchUsername();
      getUserLocation();
    }
  }, [isFocused]); // called when navigation is updated (clicking the page, or when username is changed)

  /**
   * checks if the profile is the user's own profile and sets the routes accordingly
   */
  useEffect(() => {
    if (userLocation && profileInfo) {
      setLoading(false);
    }

    if (selfProfile) {
      setRoutes([
        { key: 'first', title: 'My Listings' },
        { key: 'second', title: 'Liked' },
        { key: 'third', title: 'Contact' },
      ]);
    } else {
      setRoutes([
        { key: 'first', title: `${profileName}'s listings` },
        { key: 'third', title: `${profileName}'s contact` },
      ]);
    }
  }, [profileInfo, userLocation]);

  /**
   * @function getProfileInfo
   * @memberof Screens.ProfileScreen
   * @async
   * @param {String} username - The username of the profile to fetch
   * @description Fetches the profile information for a given username.
   * @returns {void}
   */
  const getProfileInfo = async function (username) {
    console.log(`Fetching profile info for ${username}`);
    try {
      const fetchUrl = `${serverIp}/api/profile?username=${encodeURIComponent(
        getStoredUsername()
      )}&password=${getStoredPassword()}&profileName=${username}`;
      console.log(fetchUrl);
      const profileResponse = await fetch(fetchUrl, {
        method: 'GET',
      });
      const profileData = await profileResponse.json();
      // console.log(profileData);

      if (profileResponse.status <= 201) {
        setProfileInfo({
          likedListings: profileData.likedListings.map((listing) => {
            const timeSince = calculateTimeSince(listing.PostDate);
            return {
              ...listing,
              TimeSince: timeSince,
            };
          }),
          userListings: profileData.userListings.map((listing) => {
            const timeSince = calculateTimeSince(listing.PostDate);
            return {
              ...listing,
              TimeSince: timeSince,
            };
          }),
          userRatings: profileData.ratings.reduce(
            (acc, rating) => ({ ...acc, ...rating }),
            {}
          ),
          profilePicture: profileData.profilePicture,
          coverPicture: profileData.coverPicture,
          email: profileData.email,
        });

        // Set the contactInfo state
        const updatedContactInfo = { ...contactInfo };
        for (const key in profileData.contactInfo) {
          updatedContactInfo[key].hidden = profileData.contactInfo[key].hidden;
          updatedContactInfo[key].data = profileData.contactInfo[key].data;
        }
        setContactInfo(updatedContactInfo);

        const initialLikeStates = Object.fromEntries(
          [...profileData.likedListings, ...profileData.userListings].map(
            (listing) => [listing.ListingId, listing.liked]
          )
        );
        setLikeStates(initialLikeStates);

        console.log(`Profile for ${username} fetched successfully`);
      } else {
        console.log(
          'Error fetching profile:',
          profileResponse.status
          // profileData
        );
      }
    } catch (err) {
      console.log('Error:', err);
    }
  };

  // Like states
  const handleLikePress = async (listingId) => {
    // toggle the like
    const newLikeStates = { ...LikeStates }; // Create a copy of the current LikeStates
    newLikeStates[listingId] = !newLikeStates[listingId]; // Update the liked status

    const likeData = {
      username: await SecureStore.getItemAsync('username'),
      listingId: listingId,
    };

    // Update the backend
    const likedResponse = await fetch(`${serverIp}/api/like`, {
      method: newLikeStates[listingId] ? 'POST' : 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(likeData),
    });

    if (likedResponse.status > 201) {
      console.log('Error Liking listing:', listingId, likedResponse.status);
    }

    // Update the state with the new Like states object
    setLikeStates(newLikeStates);

    console.log(
      `${
        newLikeStates[listingId] ? 'Likered' : 'UnLikered'
      } listing ID ${listingId}`
    );
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor:
          theme === 'light' ? Colors.BB_darkRedPurple : Colors.BB_violet,
      }}
      style={{
        backgroundColor: Colors.bone,
        height: 44,
      }}
      renderLabel={({ focused, route }) => (
        <Text
          style={[
            {
              color:
                theme === 'light' ? Colors.BB_darkRedPurple : Colors.BB_violet,
              fontWeight: 'bold',
              fontSize: 14,
              textAlign: 'center',
            },
          ]}
        >
          {route.title}
        </Text>
      )}
    />
  );

  const handleLogout = () => {
    clearStoredCredentials();
    setLoading(true);
    navigation.navigate('Login');
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <BouncePulse />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme === 'light' ? Colors.BB_bone : '#1e1e1e',
      }}
    >
      <View style={styles.pageHeader} />
      {/* //Cover Photo */}
      <View style={{ width: '100%' }}>
        <Image
          source={{
            uri: profileInfo.coverPicture,
          }}
          placeholder={default_blurhash}
          resizeMode="cover"
          style={{
            width: '100%',
            height: 0.2 * screenHeight,
            borderWidth: 1,
            borderColor:
              theme === 'light' ? Colors.BB_darkRedPurple : Colors.BB_violet,
            position: 'absolute',
          }}
        />
      </View>

      {/* //Profile Picture */}
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Image
          source={{
            uri: profileInfo.profilePicture,
          }}
          placeholder={default_blurhash}
          resizeMode="cover"
          style={{
            height: 0.38 * screenWidth,
            width: 0.38 * screenWidth,
            borderRadius: 999,
            borderColor:
              theme === 'light' ? Colors.BB_darkRedPurple : Colors.BB_violet,
            borderWidth: 2,
            marginTop: -90,
            position: 'absolute',
            top: 0.2 * screenHeight,
            backgroundColor: theme === 'light' ? 'white' : '#2d2d30',
          }}
        />
        <Text
          style={{
            top: 0.28 * screenHeight,
            marginTop: 10,
            marginBottom: 5,
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: 25,
            color: theme === 'light' ? Colors.BB_darkRedPurple : Colors.BB_bone,
          }}
        >
          {profileName}
        </Text>

        {/* Rating, Following, Likes */}
        <View
          style={{
            paddingVertical: 2,
            flexDirection: 'row',
            top: 0.28 * screenHeight,
            alignItems: 'center',
          }}
        >
          {/* Listings */}
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontStyle: 'normal',
                fontWeight: 'bold',
                fontSize: 20,
                color:
                  theme === 'light' ? Colors.BB_darkRedPurple : Colors.BB_bone,
              }}
            >
              {profileInfo.userListings?.length}
            </Text>
            <Text
              style={{
                fontStyle: 'normal',
                color:
                  theme === 'light' ? Colors.BB_darkRedPurple : Colors.BB_bone,
              }}
            >
              Listings
            </Text>
          </View>
          {/* Rating */}
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              marginHorizontal: selfProfile ? 25 : 10,
              marginEnd: !selfProfile ? -10 : 25,
            }}
          >
            <Text
              style={{
                fontStyle: 'normal',
                fontWeight: 'bold',
                fontSize: 20,
                color:
                  theme === 'light' ? Colors.BB_darkRedPurple : Colors.BB_bone,
              }}
            >
              {profileInfo.userRatings.AverageRating
                ? profileInfo.userRatings.AverageRating.toFixed(1)
                : 'N/A'}
              {profileInfo.userRatings.RatingCount > 0 && (
                <Entypo
                  name="star"
                  size={20}
                  color={theme === 'light' ? 'gold' : Colors.BB_violet}
                  style={styles.ratingStar}
                />
              )}
            </Text>
            <Text
              style={{
                alignContent: 'center',
                fontStyle: 'normal',
                color:
                  theme === 'light' ? Colors.BB_darkRedPurple : Colors.BB_bone,
              }}
            >
              Rating ({profileInfo.userRatings.RatingCount})
            </Text>
          </View>

          {/* LIKED */}
          {selfProfile && (
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontStyle: 'normal',
                  fontWeight: 'bold',
                  fontSize: 20,
                  color:
                    theme === 'light'
                      ? Colors.BB_darkRedPurple
                      : Colors.BB_bone,
                }}
              >
                {profileInfo.likedListings?.length}
              </Text>
              <Text
                style={{
                  fontStyle: 'normal',
                  color:
                    theme === 'light'
                      ? Colors.BB_darkRedPurple
                      : Colors.BB_bone,
                }}
              >
                Liked
              </Text>
            </View>
          )}
        </View>
        {/* Logout and Edit Profile Buttons */}
        {selfProfile && (
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 10,
              top: 0.28 * screenHeight,
              marginBottom: -100,
            }}
          >
            {/* Logout */}
            <View style={{ paddingHorizontal: 10 }}>
              <TouchableOpacity onPress={handleLogout} style={styles.button}>
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            </View>
            {/* Edit Profile */}
            <View style={{ paddingHorizontal: 10 }}>
              <TouchableOpacity
                onPress={() => {
                  setLoading(true);
                  navigation.navigate('EditProfile', {
                    profileName: profileName,
                    profilePicture: profileInfo.profilePicture,
                    coverPicture: profileInfo.coverPicture,
                    email: profileInfo.email,
                  });
                }}
                style={{ ...styles.button, width: 114 }}
              >
                <Text style={styles.buttonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {/* Rate User Button */}
        {!selfProfile && (
          <View
            style={{
              flexDirection: 'row',
              marginTop: 5,
              top: 0.28 * screenHeight,
              marginBottom: -100,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setLoading(true);
                navigation.navigate('RatingScreen', {
                  profileInfo: profileInfo,
                  username: profileName,
                });
              }}
              style={{ ...styles.button }}
            >
              <Text
                style={{
                  fontStyle: 'normal',
                  color: 'white',
                }}
              >
                Rate User
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Back button */}
      {!selfProfile && (
        <TouchableOpacity
          onPress={() => {
            setLoading(true);
            navigation.navigate('BottomNavOverlay');
          }}
          style={styles.circleContainer}
        >
          <View style={styles.circle}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={30}
              color={
                theme === 'light' ? Colors.BB_darkRedPurple : Colors.BB_violet
              }
            />
          </View>
        </TouchableOpacity>
      )}

      <View
        style={{
          flex: 1,
          marginHorizontal: 22,
          marginTop: selfProfile ? 20 : 0,
        }}
      >
        <TabView
          navigationState={{ index, routes }}
          renderScene={({ route }) => {
            switch (route.key) {
              case 'first':
                return (
                  <ListingsRoute
                    onPressListing={onPressListing}
                    data={profileInfo.userListings}
                    text={'user'}
                    styles={styles}
                  />
                );
              case 'second':
                return (
                  <ListingsRoute
                    onPressListing={onPressListing}
                    data={profileInfo.likedListings}
                    text={'liked'}
                    styles={styles}
                  />
                );
              case 'third':
                return (
                  <ContactInfoRoute
                    selfProfile={selfProfile}
                    contactInfo={contactInfo}
                    setContactInfo={setContactInfo}
                    styles={styles}
                  />
                );
              default:
                return null;
            }
          }}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
        />
      </View>

      {/* Settings */}
      {selfProfile && (
        <TouchableOpacity
          onPress={() => {
            setLoading(true);
            navigation.navigate('SettingsScreen', {
              prevContactInfo: contactInfo,
              profileName: profileName,
            });
          }}
          style={{
            position: 'absolute',
            top: Platform.OS == 'ios' ? 55 : 40,
            right: Platform.OS == 'ios' ? 10 : 15,
          }}
        >
          <View style={styles.circle}>
            <MaterialIcons
              name="settings"
              size={30}
              color={
                theme === 'light' ? Colors.BB_darkRedPurple : Colors.BB_violet
              }
            />
          </View>
        </TouchableOpacity>
      )}

      {/* Overlay for displaying selected listing */}
      {selectedListing && (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <View
            style={{
              top:
                Platform.OS == 'ios'
                  ? 0.03 * screenHeight
                  : -0.05 * screenHeight,
            }}
          >
            <Listing
              key={selectedListing.ListingId}
              item={selectedListing}
              LikeStates={LikeStates}
              handleLikePress={handleLikePress}
              numItems={selectedListing.images?.length}
              userLocation={userLocation}
              origin={'profile'}
              removeListing={(listingId) => {
                setProfileInfo((prevProfileInfo) => ({
                  ...prevProfileInfo,
                  likedListings: prevProfileInfo.likedListings.filter(
                    (item) => item.ListingId !== listingId
                  ),
                  userListings: prevProfileInfo.userListings.filter(
                    (item) => item.ListingId !== listingId
                  ),
                }));

                setSelectedListing(null);
              }}
            />
          </View>
          <TouchableOpacity
            onPress={() => setSelectedListing(null)}
            style={{
              ...styles.button,
              top: selfProfile
                ? Platform.OS === 'ios'
                  ? -0.035 * screenHeight
                  : -0.05 * screenHeight
                : Platform.OS === 'ios'
                ? -0.1 * screenHeight
                : -0.12 * screenHeight,
            }}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

export default memo(ProfileScreen);
