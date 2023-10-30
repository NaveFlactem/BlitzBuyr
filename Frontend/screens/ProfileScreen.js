import React from "react";
import { View, Text, SafeAreaView, StatusBar, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
// import { images } from "../assets";

export default function ProfileScreen({ navigation }) {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "gray",
      }}
    >
      <StatusBar backgroundColor={"gray"} />

      {/* //Cover Photo */}
      <View style={{ width: "100%" }}>
        <Image
          source={require("../screens/assets/images/cover.jpg")}
          resizeMode="cover"
          style={{ width: "100%", height: 228 }}
        />
      </View>

      {/* //Profile Picture */}
      <View style={{ flex: 1, alignItems: "center" }}>
        <Image
          source={require("../screens/assets/images/profile.png")}
          resizeMode="contain"
          style={{
            height: 155,
            width: 155,
            borderRadius: 999,
            borderColor: "black",
            borderWidth: 2,
            marginTop: -90,
          }}
        />
        <Text
          style={{
            fontStyle: "normal",
            color: "black",
            marginVertical: 8,
          }}
        >
          {" "}
          Alfonso Luis Del Rosario{" "}
        </Text>

        <Text
          style={{
            color: "black",
            fontStyle: "normal",
          }}
        >
          Computer Science
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

        {/* Followers, Following, Likes */}
        <View
          style={{
            paddingVertical: 8,
            flexDirection: "row",
          }}
        >
          {/* FOLLOWERS */}
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
                color: "black",
              }}
            >
              122
            </Text>
            <Text
              style={{
                fontStyle: "normal",
                color: "black",
              }}
            >
              Followers
            </Text>
          </View>

          {/* FOLLOWING */}
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
                color: "black",
              }}
            >
              67
            </Text>
            <Text
              style={{
                fontStyle: "normal",
                color: "black",
              }}
            >
              Following
            </Text>
          </View>

          {/* LIKES */}
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
              Likes
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
        <TouchableOpacity style={{
          width: 124,
          height: 36,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "black",
          borderRadius: 10,
          marginHorizontal: 160
        }}>

          <Text style={{
            fontStyle: "normal",
            color: "white"
          }}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      </View>

    </SafeAreaView>
  );
}
