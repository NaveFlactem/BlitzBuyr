import React from "react";
import { View, Text } from "react-native";

export default function ProfileScreen({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'gray' }}>
            <Text
                style={{ fontSize: 26, fontWeight: 'bold' }}>Ptofile Screen</Text>
        </View>
    );
}