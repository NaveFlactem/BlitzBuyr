import React, {useCallback, useState, useEffect, memo} from "react";
import { Dimensions, Text, StyleSheet, View, FlatList, ScrollView, TouchableOpacity } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import Colors from "../constants/Colors";

const TagDrawer = memo(() => { 

    return(
        <View style={styles.container}>
            <View style={styles.drawer}>
                <Text>Tag Drawer</Text>
            </View>
        </View>
    )
});

export default TagDrawer;

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.2)',
            justifyContent: 'center',
            alignItems: 'center'
        },
        drawer: {
            position: 'absolute',
            left: 0,
            top: 0.08 * screenHeight,
            width: 0.45 * screenWidth,
            height: screenHeight,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 12,
        },
});
