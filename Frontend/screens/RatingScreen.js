import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'; // Import the Button component
import { serverIp } from '../config.js';
import { getStoredUsername } from './auth/Authenticate.js';
import { useThemeContext } from '../components/visuals/ThemeProvider.js';
import { getThemedStyles } from '../constants/Styles.js';


const RatingScreen = ({ navigation, route }) => {
  const styles = getThemedStyles(useThemeContext().theme).RatingScreen; 
  const [selectedRating, setSelectedRating] = useState(0);
  console.log(route.params);

  const handleRating = (value) => {
    if (selectedRating === value) {
      setSelectedRating(selectedRating - 0.5);
    } else {
      setSelectedRating(value);
    }
  };

  const handleSubmitRating = () => {
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

  const renderStars = () => {
    const starIcons = [];
    for (let i = 1; i <= 5; i++) {
      starIcons.push(
        <TouchableOpacity
          key={i}
          style={[styles.starButton, i < 5 && styles.starMargin]}
          onPress={() => handleRating(i)}
        >
          {i <= selectedRating ? (
            <MaterialCommunityIcons name="star" size={60} color="black" />
          ) : i - 0.5 === selectedRating ? (
            <MaterialCommunityIcons
              name="star-half-full"
              size={60}
              color="black"
            />
          ) : (
            <MaterialCommunityIcons
              name="star-outline"
              size={60}
              color="black"
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
        <MaterialCommunityIcons name="arrow-left" size={30} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Rate User {route.params.username}</Text>
      <Image
        source={{ uri: route.params.profileInfo.profilePicture }}
        style={styles.profilePic}
      />
      <View style={styles.ratingContainer}>{renderStars()}</View>
      <Button title="Submit Rating" onPress={handleSubmitRating} />
    </View>
  );
};


export default RatingScreen;
