/**
 * @namespace RatingScreen
 * @memberof Screens
 * @description - RatingScreen is a screen that allows users to rate another user
 *
 */
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Button,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'; // Import the Button component
import { useThemeContext } from '../components/visuals/ThemeProvider.js';
import { serverIp } from '../config.js';
import { getThemedStyles } from '../constants/Styles.js';
import { getStoredUsername } from './auth/Authenticate.js';
import Colors from '../constants/Colors.js';

/**
 * @function
 * @name RatingScreen
 * @memberof Screens.RatingScreen
 * @param {Object} navigation - The navigation object used to navigate between screens.
 * @param {Object} route - Information about the current route.
 * @returns {void}
 * @description - A screen that allows users to rate a listing.
 */
const RatingScreen = ({ navigation, route }) => {
  const { theme } = useThemeContext();
  const styles = getThemedStyles(useThemeContext().theme).RatingScreen;
  const [selectedRating, setSelectedRating] = useState(0);
  console.log(route.params);

  /**
   * @function
   * @memberof Screens.RatingScreen
   * @param {number} value - The value containing the rating
   * @returns {void}
   * @description Handles the selection of a rating value.  Allows the rating to be deducted by half if selected again.
   *                - If the value matches the current selectedRating, decreases the selectedRating by 0.5 thus allowing for half ratings
   *                - If the value differs from the current selectedRating, sets the selectedRating to the provided value.
   */
  const handleRating = (value) => {
    if (selectedRating === value) {
      setSelectedRating(selectedRating - 0.5);
    } else {
      setSelectedRating(value);
    }
  };

  /**
   * @function
   * @name handleSubmitRating
   * @memberof Screens.RatingScreen
   * @returns {void}
   * @description Handles the submission of a rating to the backend API.
   *              Sends a POST request to the backend API
   *              Handles the response from the backend
   *              Logs errors if there's an issue while submitting the rating.
   */
  const handleSubmitRating = () => {
    if (selectedRating < 1 || selectedRating > 5) {
      // show some indicator that the rating was unsuccessful
      Alert.alert('Please select a rating between 1 and 5 stars');
      return;
    }

    const ratingPayload = {
      username: getStoredUsername(),
      userRated: route.params.username,
      rating: selectedRating,
    };

    // Make a POST request to your backend API to submit the rating
    fetch(`${serverIp}/api/rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ratingPayload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Handle the response from the backend
        // show some indicator that the rating was successful

        // then we go back
        navigation.goBack();
      })
      .catch((error) => {
        console.error('Error submitting rating:', error);
      });
  };

  /**
   * @function
   * @name renderStars
   * @memberof Screens.RatingScreen
   * @returns {Array<JSX.Element>} Returns an array of JSX elements representing star icons for rating.
   * @description Dynamically generates an array of star icons based on the selected rating.
   *              Uses TouchableOpacity components to allow the user to press their desirred rating.
   *              Renders star icons filled, half-filled, or outlined based on the selected rating value.
   *              Uses MaterialCommunityIcons for star visualization.
   */

  const renderStars = () => {
    const starIcons = [];
    for (let i = 1; i <= 5; i++) {
      starIcons.push(
        <TouchableOpacity
          key={i}
          style={[styles.starButton, i < 5 && styles.starMargin]}
          onPress={() => handleRating(i)}
          testID={`rating-button-${i}`} // Adding testID prop to TouchableOpacity for testing
        >
          {i <= selectedRating ? (
            <MaterialCommunityIcons
              name="star"
              size={60}
              color={theme === 'dark' ? Colors.BB_violet : 'black'}
            />
          ) : i - 0.5 === selectedRating ? (
            <MaterialCommunityIcons
              name="star-half-full"
              size={60}
              color={theme === 'dark' ? Colors.BB_violet : 'black'}
            />
          ) : (
            <MaterialCommunityIcons
              name="star-outline"
              size={60}
              color={theme === 'dark' ? Colors.BB_violet : 'black'}
            />
          )}
        </TouchableOpacity>,
      );
    }
    return starIcons;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <MaterialCommunityIcons
          name="arrow-left"
          size={30}
          color={theme === 'dark' ? Colors.BB_violet : 'black'}
        />
      </TouchableOpacity>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Rate User {route.params.username}</Text>
        <Image
          source={{ uri: route.params.profileInfo.profilePicture }}
          style={styles.profilePic}
        />
        <View style={styles.ratingContainer}>{renderStars()}</View>
        <TouchableOpacity onPress={handleSubmitRating}>
          <View style={styles.submitButton}>
            <Text style={styles.submitText}>Submit Rating</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RatingScreen;
