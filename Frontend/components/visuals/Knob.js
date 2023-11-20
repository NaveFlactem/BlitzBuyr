import React, {memo} from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import { PanGestureHandler, State } from 'react-native-gesture-handler';


// rotate the knob as the user drags it
const Knob = memo(() => {
    const { gestureHandler, translation, state } = usePanGestureHandler();
    const rotate = withOffset({
        value: translation.x,
        state,
        offset: new Value(0),
    });
    return (
        <PanGestureHandler {...gestureHandler}>
        <Animated.View style={{ transform: [{ rotate: concat(rotate, 'deg') }] }}>
            <Image source={require('../../assets/icon_background_transparent_upright.png')} />
        </Animated.View>
        </PanGestureHandler>
    );
})

export default Knob;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center'
    },
    knob: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
});


