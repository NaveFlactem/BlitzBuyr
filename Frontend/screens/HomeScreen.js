import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const HomeScreen = () => {
    const navigation = useNavigation();

    return (
        <View>
            <Text>Listing Home Screen</Text>
        </View>
    );
}

export default HomeScreen;