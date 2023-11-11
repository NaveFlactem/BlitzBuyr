import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import Colors from '../constants/Colors';

const BouncePulse = () => {
    const translateY1 = useRef(new Animated.Value(0)).current;
    const translateY2 = useRef(new Animated.Value(0)).current;
    const translateY3 = useRef(new Animated.Value(0)).current;
  
    const startAnimation = (animatedValue, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      );
    };
  
    useEffect(() => {
      const anim1 = startAnimation(translateY1, 0);   // No delay
      const anim2 = startAnimation(translateY2, 333); // 1/3 of the cycle
      const anim3 = startAnimation(translateY3, 666); // 2/3 of the cycle
  
      anim1.start();
      anim2.start();
      anim3.start();
  
      return () => {
        anim1.stop();
        anim2.stop();
        anim3.stop();
      };
    }, []);
  
    const translateYInterpolated1 = translateY1.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -15],
    });
  
    const translateYInterpolated2 = translateY2.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -15],
    });
  
    const translateYInterpolated3 = translateY3.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -15],
    });
  
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.dot, { transform: [{ translateY: translateYInterpolated1 }] }]} />
        <Animated.View style={[styles.dot, { transform: [{ translateY: translateYInterpolated2 }] }]} />
        <Animated.View style={[styles.dot, { transform: [{ translateY: translateYInterpolated3 }] }]} />
      </View>
    );
  };

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    height: 0.1 * screenHeight, 
  },
  dot: {
    backgroundColor: Colors.BB_darkRedPurple, 
    width: 20, 
    height: 20, 
    borderRadius: 10, 
    marginHorizontal: 4, 
  },
});

export default BouncePulse;
