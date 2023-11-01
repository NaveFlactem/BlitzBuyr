import React from "react";
import { StyleSheet, View, Image, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
    image : {
        height: 0.1 * screenHeight,
        width: 0.2 * screenWidth,
        
    },
});

const BottomBarImage = () => {
    return (
        <View>
            <Image style={styles.image} source={require("../assets/icon_background_transparent_upright.png")}/>
        </View>
    )
};

export default BottomBarImage;