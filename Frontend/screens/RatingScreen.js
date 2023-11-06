import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Button } from 'react-native'; // Import the Button component
import { MaterialCommunityIcons } from "@expo/vector-icons";

const StarRating = ({ navigation }) => {
  const [selectedRating, setSelectedRating] = useState(0);

  const handleRating = (value) => {
    setSelectedRating(value);
  };

  const handleSubmitRating = () => {
    // Add logic to submit the rating to your backend or perform any other action.
    // You can use the selectedRating state to get the user's selected rating.
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
            <MaterialCommunityIcons
              name="star"
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
        </TouchableOpacity>
      );
    }
    return starIcons;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Profile")}
        style={styles.backButton}
      >
        <MaterialCommunityIcons name="arrow-left" size={30} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Rate This User</Text>
      <Image
        source={require("../screens/assets/images/profile.png")}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: '5%',
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: '5%',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 20, // Add margin to move the button down
  },
  starButton: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starMargin: {
    marginRight: 4,
  },
  backButton: {
    position: 'absolute',
    top: '7%',
    left: '7%',
  },
  starIcon: {
    width: 60,
    height: 60,
  },
});

export default StarRating;