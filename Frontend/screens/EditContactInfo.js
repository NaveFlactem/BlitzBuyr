import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { getStoredUsername } from "./auth/Authenticate";
import { serverIp } from "../config";

const EditContactInfo = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const [contactInfo, setContactInfo] = useState(route.params?.prevContactInfo);

  const handleInputChange = (key, value) => {
    setContactInfo((prevContactInfo) => ({
      ...prevContactInfo,
      [key]: { ...prevContactInfo[key], data: value },
    }));
  };

  const saveChanges = async () => {
    try {
      let username = getStoredUsername();
      const response = await fetch(`${serverIp}/api/editcontactinfo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          contactInfo: contactInfo,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        // update the profile page's profile name
        navigation.setOptions({
          params: { profileName: username },
        });

        // go back to profile page, WIP MAYBE INCLUDE A SUCCESS MESSAGE OR SOMETHING
        navigation.goBack();
      } else {
        console.log(response);
        // handle error
        alert("error");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.BB_bone,
        paddingHorizontal: 22,
      }}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 25,
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setLoading(true);
            navigation.navigate("BottomNavOverlay");
          }}
          style={styles.circleContainer}
        >
          <View style={styles.circle}>
            <MaterialCommunityIcons name="arrow-left" size={30} color="black" />
          </View>
        </TouchableOpacity>

        <Text
          style={{
            position: "absolute",
            color: Colors.BB_darkRedPurple,
            fontSize: 22.5,
            fontWeight: "bold",
            top: 20,
          }}
        >
          Edit Contact
        </Text>
      </View>

      <ScrollView style={{ marginTop: 50 }}>
        <View style={styles.container}>
          {Object.keys(contactInfo).map((key) => (
            <View key={key} style={styles.itemContainer}>
              <Text style={styles.title}>
                {key.charAt(0).toUpperCase() + key.substring(1)}
              </Text>
              <TextInput
                style={styles.data}
                value={contactInfo[key].data}
                onChangeText={(value) => handleInputChange(key, value)}
              />
            </View>
          ))}
        </View>

        {/* SAVE CHANGES BUTTON */}
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={saveChanges}
            style={{
              width: 130,
              height: 50,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: Colors.BB_darkRedPurple,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: Colors.black,
              marginVertical: 20,
            }}
          >
            <Text
              style={{
                fontStyle: "normal",
                color: Colors.white,
                fontWeight: "500",
                fontSize: 15,
              }}
            >
              Save Changes
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    marginBottom: 20,
  },
  itemContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  data: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 6,
    padding: 8,
  },
  circleContainer: {
    position: "absolute",
    top: 15,
    left: Platform.OS == "ios" ? 15 : 0,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "black",
  },
};

export default EditContactInfo;
