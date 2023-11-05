import React, { useEffect, useState, memo } from "react";
import { serverIp } from "../config.js";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import * as SecureStore from "expo-secure-store";

const image_one = require("../screens/assets/images/image_one.jpg");
const image_two = require("../screens/assets/images/image_two.jpg");
const image_three = require("../screens/assets/images/image_three.jpg");
const image_four = require("../screens/assets/images/image_four.jpg");
const image_five = require("../screens/assets/images/image_five.jpg");
const image_six = require("../screens/assets/images/image_six.jpg");
const image_seven = require("../screens/assets/images/image_five.jpg");
const image_eight = require("../screens/assets/images/image_one.jpg");

const userListings = [
  image_one,
  image_two,
  image_three,
  image_four,
  image_five,
  image_six,
  image_seven,
  image_eight,
]; //Will hold the list of Liked photos of user

const savedListings = [
  image_one,
  image_two,
  image_three,
  image_four,
  image_five,
  image_six,
  image_seven,
  image_eight,
]; //Will hold the list of saved listings of user

const userListingsRoutes = () => (
  <View style={{ flex: 1 }}>
    <FlatList
      data={userListings}
      numColumns={3}
      renderItem={({ item, index }) => (
        <View
          style={{
            flex: 1,
            aspectRatio: 1,
            margin: 3,
          }}
        >
          <Image
            key={index}
            source={item}
            style={{ width: "100%", height: "100%", borderRadius: 12 }}
          />
        </View>
      )}
    />
  </View>
);

const savedListingsRoutes = () => (
  <View style={{ flex: 1 }}>
    <FlatList
      data={savedListings}
      numColumns={3}
      renderItem={({ item, index }) => (
        <View
          style={{
            flex: 1,
            aspectRatio: 1,
            margin: 3,
          }}
        >
          <Image
            key={index}
            source={item}
            style={{ width: "100%", height: "100%", borderRadius: 12 }}
          />
        </View>
      )}
    />
  </View>
);

const renderScene = SceneMap({
  first: userListingsRoutes,
  second: savedListingsRoutes,
});

function ProfileScreen({ navigation }) {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [likedListings, setLikedListings] = useState([]);
  const [userListings, setUserListings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const username = await SecureStore.getItemAsync("username");
      getProfileInfo(username);
    };
  
    fetchData(); // Call the async function
  }, []);
  
  getProfileInfo = async function (username) {
    try {
      const profileResponse = await fetch(
        `${serverIp}/api/profile?username=${encodeURIComponent(username)}`,
        {
          method: "GET",
        }
      );
  
      if (profileResponse.status <= 201) {
        const profileData = await profileResponse.json();
        console.log(username);
        console.log(profileData);
  
        setLikedListings(profileData.likedListings);
        setUserListings(profileData.userListings);
  
        console.log("Profile fetched successfully");
      } else {
        console.log("Error fetching profile:", profileResponse.status);
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const [routes] = useState([
    { key: "first", title: "My Listings" },
    { key: "second", title: "Liked Listings" },
  ]);

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: "gray",
      }}
      style={{
        backgroundColor: "white",
        height: 44,
      }}
      renderLabel={({ focused, route }) => (
        <Text style={[{ color: focused ? "black" : "gray" }]}>
          {route.title}
        </Text>
      )}
    />
  );

  async function clearCredentials() {
    try {
      await SecureStore.deleteItemAsync("username");
      await SecureStore.deleteItemAsync("password");
      console.log("Stored credentials cleared.");
    } catch (error) {
      console.error("Error clearing stored credentials:", error);
    }
  }

  const handleLogout = () => {
    clearCredentials();
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <StatusBar backgroundColor={"gray"} />

      {/* //Cover Photo */}
      <View style={{ width: "100%" }}>
        <Image
          source={require("../screens/assets/images/cover.jpg")}
          resizeMode="cover"
          style={{ width: "100%", height: 180 }}
        />
      </View>

      {/* //Profile Picture */}
      <View style={{ flex: 1, alignItems: "center" }}>
        <Image
          source={require("../screens/assets/images/profile.png")}
          resizeMode="contain"
          style={{
            height: 145,
            width: 145,
            borderRadius: 999,
            borderColor: "black",
            borderWidth: 2,
            marginTop: -90,
          }}
        />
        <Text
          style={{
            marginTop: 5,
            fontStyle: "normal",
            fontWeight: "bold",
            fontSize: 20,
            color: "black",
          }}
        >
          My Username
        </Text>

        {/* Location Information */}
        <View
          style={{
            flexDirection: "row",
            marginVertical: 6,
            alignItems: "center",
          }}
        >
          <MaterialIcons name="location-on" size={24} color="black" />
          <Text
            style={{
              fontStyle: "normal",
              marginLeft: 4,
            }}
          >
            Santa Cruz, California
          </Text>
        </View>

        {/* Rating, Following, Likes */}
        <View
          style={{
            paddingVertical: 2,
            flexDirection: "row",
          }}
        >

          {/* Posts */}
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              marginHorizontal: 4,
            }}
          >
            <Text
              style={{
                fontStyle: "normal",
                fontWeight: "bold",
                fontSize: 20,
                color: "black",
              }}
            >
              115
            </Text>
            <Text
              style={{
                fontStyle: "normal",
                color: "black",
              }}
            >
              Posts
            </Text>
          </View>

          {/* RATING */}
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              marginHorizontal: 20,
            }}
          >
            <Text
              style={{
                fontStyle: "normal",
                fontWeight: "bold",
                fontSize: 20,
                color: "black",
              }}
            >
              4.5
            </Text>
            <Text
              style={{
                fontStyle: "normal",
                color: "black",
              }}
            >
              Rating
            </Text>
          </View>

          {/* LIKED */}
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              marginHorizontal: 4,
            }}
          >
            <Text
              style={{
                fontStyle: "normal",
                fontWeight: "bold",
                fontSize: 20,
                color: "black",
              }}
            >
              24
            </Text>
            <Text
              style={{
                fontStyle: "normal",
                color: "black",
              }}
            >
              Liked
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          {/* Logout Button */}
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
          
          {/* Edit Profile Button */}
          <TouchableOpacity
            onPress={() => navigation.navigate("EditProfile")}
            style={{
              width: 110,
              height: 36,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "blue",
              borderRadius: 10,
              marginHorizontal: 0,
              top: 10,
            }}
          >
            <Text
              style={{
                fontStyle: "normal",
                color: "white",
              }}
            >
              Edit Profile
            </Text>
          </TouchableOpacity>

          {/* Rate User Button */}
          <TouchableOpacity
            style={{
              width: 110,
              height: 36,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "blue",
              borderRadius: 10,
              marginHorizontal: 10,
              top: 10,
            }}
          >
            <Text
              style={{
                fontStyle: "normal",
                color: "white",
              }}
            >
              Rate User
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ flex: 1, marginHorizontal: 22, marginTop: -120 }}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayoiut={{ width: layout.width }}
          renderTabBar={renderTabBar}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    width: 110,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "blue",
    borderRadius: 10,
    marginHorizontal: 10,
    top: 10,
  },
  logoutButtonText: {
    fontStyle: "normal",
    color: "white",
  },
});


export default memo(ProfileScreen);