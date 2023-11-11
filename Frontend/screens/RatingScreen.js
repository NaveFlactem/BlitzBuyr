import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Button,
} from "react-native"; // Import the Button component
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getStoredUsername } from "./auth/Authenticate.js";
import { serverIp } from "../config.js";

const RatingScreen = ({ navigation, route }) => {
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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
        console.error("Error submitting rating:", error);
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
          ) : (
            i - 0.5 === selectedRating ? (
              <MaterialCommunityIcons name="star-half-full" size={60} color="black" />
            ) : (
              <MaterialCommunityIcons name="star-outline" size={60} color="black" />
            )
          )}
        </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: "5%",
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: "5%",
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 20, // Add margin to move the button down
  },
  starButton: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  starMargin: {
    marginRight: 4,
  },
  backButton: {
    position: "absolute",
    top: "7%",
    left: "7%",
  },
});

export default RatingScreen;