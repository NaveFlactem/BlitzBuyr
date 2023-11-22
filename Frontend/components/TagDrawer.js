import React, { memo } from "react";
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../constants/Colors";

const TagDrawer = memo(
  ({ tags, handleTagPress, fetchListings, handleMenuPress, isDrawerOpen }) => {
    return (
      <View style={styles.drawerContainer}>
        {isDrawerOpen && (
          <TouchableOpacity onPress={handleMenuPress}>
            <View style={styles.outsideDrawer} />
          </TouchableOpacity>
        )}
        <ScrollView style={styles.drawerScroll}>
          <View style={styles.drawer}>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => {
                fetchListings();
                handleMenuPress();
              }}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
            {tags.map((tag, tagIndex) => (
              <TouchableOpacity
                key={tagIndex}
                style={styles.tagContainer}
                onPress={() => {
                  handleTagPress(tagIndex);
                }}
              >
                <View
                  style={[
                    styles.tagSelected,
                    { opacity: tag.selected ? 1 : 0.3 },
                  ]}
                />
                <View
                  style={[styles.rhombus, { opacity: tag.selected ? 0.15 : 0 }]}
                />
                <Text style={styles.tagText}>{tag.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.spacer} />
        </ScrollView>
      </View>
    );
  },
);

export default TagDrawer;

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  drawerContainer: {
    position: "absolute",
    height: screenHeight,
    width: 0.4 * screenWidth,
    zIndex: 110,
    left: 0.6 * screenWidth,
    backgroundColor: Colors.BB_darkRedPurple,
  },
  drawerScroll: {
    top: 0.08 * screenHeight,
    width: 0.4 * screenWidth,
    height: "100%",
    backgroundColor: Colors.BB_darkRedPurple,
    borderRightWidth: 2,
    borderRightColor: Colors.BB_orange,
  },
  drawer: {
    alignSelf: "center",
    left: "5%",
    borderRadius: 20,
    paddingTop: 20,
    height: "auto",
    width: "auto",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 12,
    backgroundColor: Colors.BB_darkerRedPurple,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  outsideDrawer: {
    position: "absolute",
    height: screenHeight,
    width: screenWidth,
    zIndex: 11,
  },
  tagContainer: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 20,
    alignContent: "center",
    justifyContent: "center",
    textAlign: "center",
    height: 0.06 * screenHeight,
    width: 0.3 * screenWidth,
    zIndex: 120,
    ...Platform.select({
      ios: {
        shadowColor: "white",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  tagText: {
    color: Colors.white,
    fontSize: 18,
    alignSelf: "center",
    fontWeight: "bold",
  },
  rhombus: {
    alignSelf: "center",
    position: "absolute",
    width: 0.04 * screenHeight,
    aspectRatio: 1,
    backgroundColor: Colors.BB_darkPink,
    opacity: 0.15,
    transform: [{ rotate: "45deg" }],
  },
  tagSelected: {
    alignSelf: "center",
    backgroundColor: Colors.BB_darkRedPurple,
    borderRadius: 20,
    height: "100%",
    width: "100%",
    position: "absolute",
    borderColor: Colors.BB_bone,
    borderWidth: 1,
  },
  applyButton: {
    borderRadius: 20,
    height: 0.06 * screenHeight,
    width: 0.3 * screenWidth,
    marginBottom: 10,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.BB_pink,
    borderColor: Colors.BB_bone,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: Colors.BB_bone,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  applyButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  swipeArea: {
    position: "absolute",
    width: 0.05 * screenWidth,
    height: screenHeight,
    left: 0,
    zIndex: 200,
  },
  spacer: {
    position: "relative",
    height: 0.2 * screenHeight,
  },
});
