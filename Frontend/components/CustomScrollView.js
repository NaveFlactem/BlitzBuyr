import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

const CustomScrollView = memo(({ children, onRefresh, currentIndex }) => {
  const scrollY = useSharedValue(0);
  const refreshing = useSharedValue(false);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentScrollY = event.contentOffset.y;

      if (currentIndex === 0) {
        if (currentScrollY < 0) {
          scrollY.value = currentScrollY;

          if (currentScrollY < -100 && !refreshing.value) {
            refreshing.value = true;
            runOnJS(onRefresh)();
          }
        }
      } else {
        scrollY.value = 0;
      }
    },
    onEndDrag: (event) => {
      refreshing.value = false;

      if (scrollY.value < 0) {
        scrollY.value = 0;
      }
    },
  });

  return (
    <Animated.ScrollView
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      style={styles.scrollView}
    >
      <View style={styles.contentContainer}>{children}</View>
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
