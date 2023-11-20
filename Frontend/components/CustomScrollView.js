import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue, runOnJS } from 'react-native-reanimated';
import BouncePulse from './BouncePulse'; // Adjust path as necessary

const CustomScrollView = memo(({ children, onRefresh }) => {
  const scrollY = useSharedValue(0);
  const refreshing = useSharedValue(false);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      if (scrollY.value < -100 && !refreshing.value) {
        refreshing.value = true;
        runOnJS(onRefresh)(); // Ensure onRefresh is called on the JS thread
      }
    },
    onEndDrag: (event) => {
      refreshing.value = false;
    },
  });

  return (
    <Animated.ScrollView
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      style={styles.scrollView}
    >
      {refreshing.value && <BouncePulse />}
      <View style={styles.contentContainer}>
        {children}
      </View>
    </Animated.ScrollView>
  );
});

export default CustomScrollView;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
});
