import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Platform,
  Switch,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import Colors from "../constants/Colors";

const SettingsPage = ({ navigation }) => {
  const [loading, setLoading] = useState(true);

  const titles = {
    "Account Settings": ["Change Password", "Account Info", "Contact Info"],
    Notification: ["Account Activity", "Notification Preferences"],
    General: ["Dark Mode"],
    Privacy: ["Location"],
  };
  // const switchItems = ["Dark Mode", "Account Activity", "Location"];
  const switchItems = [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.BB_bone }}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={() => {
                setLoading(true);
                navigation.navigate("BottomNavOverlay");
              }}
              style={styles.circleContainer}
            >
              <View style={styles.circle}>
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={30}
                  color="black"
                />
              </View>
            </TouchableOpacity>
            <Text style={styles.headerText}>Settings</Text>
          </View>

          <View>
            {Object.entries(titles).map(([section, items]) => (
              <View key={section}>
                <View style={styles.sectionHeaderContainer}>
                  <Text style={styles.header}>{section}</Text>
                </View>
                {items.map((item, index) => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.settingsItems,
                      index === items.length - 1 && styles.lastItem,
                    ]}
                  >
                    <Text style={styles.itemText}>{item}</Text>

                    {switchItems.includes(item) ? (
                        <View styles={{alignItems: "center"}}>

                      <Switch
                        trackColor={{
                          false: Colors.gray,
                          true: Colors.BB_darkRedPurple,
                        }}
                        thumbColor={"white"}
                        onValueChange={() => {
                          //For Later
                        }}
                        
                        style={{padding: 0,
                        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }]}}
                        value={false}
                        />
                        </View>
                    ) : (
                      <AntDesign name="right" size={15} color="black" />
                    )}
                  </TouchableOpacity>
                ))}
                <View style={styles.horizontalBar}></View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
    flexDirection: "row",
  },
  headerText: {
    color: Colors.BB_darkRedPurple,
    fontSize: 25,
    fontWeight: "bold",
    top: 20,
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
  sectionHeaderContainer: {
    paddingTop: 20,
    paddingBottom: 5,
    paddingHorizontal: 5,
  },
  header: {
    color: Colors.BB_darkRedPurple,
    fontWeight: "bold",
    fontSize: 20,
  },
  settingsItems: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.BB_darkerRedPurple,
    paddingVertical: 20,
    paddingHorizontal: 5,
    fontWeight: "bold",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  itemText: {
    fontWeight: "500",
    color: Colors.BB_darkerRedPurple,
    fontSize: 15,
  },
  horizontalBar: {
    height: 15,
    backgroundColor: Colors.BB_darkRedPurple,
    width: "100%",
    borderRadius: 5,
  },
});

export default SettingsPage;
